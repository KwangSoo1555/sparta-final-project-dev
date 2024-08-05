import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { NotificationTypes } from "src/common/customs/enums/enum-notifications";
import { RedisConfig } from "src/database/redis/redis.config";
import { AuthService } from "src/modules/auth/auth.service";
import { CreateNoticeDto } from "src/modules/notices/dto/create-notice.dto";
import { CreateNotificationDto } from "src/notifications/notifications.dto/create-notificaion.dto";
import { NotificationsService } from "src/notifications/notifications.service";

@WebSocketGateway({
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly redisConfig: RedisConfig,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private connectedClients = [];

  @WebSocketServer()
  server: Server;

  getUserIdFromSocket(client: Socket): number | null {
    const authHeader = client.handshake.auth.token;
    console.log("Authorization Header:", authHeader);
    const token =
      authHeader && authHeader.toLowerCase().startsWith("bearer ")
        ? authHeader.substring(7) // "Bearer ".length = 7
        : null;

    if (token) {
      try {
        const decoded = this.jwtService.verify(token, {
          secret: this.configService.get<string>("ACCESS_TOKEN_SECRET"),
        });
        console.log("---------" + decoded.userId);
        console.log(typeof decoded.userId);
        return decoded.userId;
      } catch (error) {
        console.error("Invalid token", error);
        return null;
      }
    }
    return null;
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const userId = this.getUserIdFromSocket(client);
      if (userId) {
        await this.redisConfig.setUserSocketId(userId, client.id);
        this.connectedClients.push({ userId, client });
        console.log(`User ${userId} connected with socket ID ${client.id}`);
      } else {
        console.error("Unauthorized connection attempt. Disconnecting...");
        client.disconnect(); // 연결 종료
      }
    } catch (error) {
      console.error("Error during connection:", error);
      client.disconnect(); // 오류 발생 시 연결 종료
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    try {
      const userId = this.getUserIdFromSocket(client);
      if (userId) {
        //redisClient로 redisClient enstance를 가져옴
        const redisClient = this.redisConfig.getClient();
        //del으로 redis에서 연결에 사용했던 socketId를 삭제 - 이유 : redisConfig로 호출 시 에러 발생
        await redisClient.del(`user : ${userId.toString()} : socketId`);
        this.connectedClients = this.connectedClients.filter((c) => c.client !== client);
        console.log(`User ${userId} disconnected`);
      } else {
        console.error("Unexpected disconnect without valid user Id");
      }
    } catch (error) {
      console.error("Error during disconnection:", error);
    }
  }

  //notificationData = notificationDTO로 만든 알림 내용
  async sendNotification(
    userIds: number[],
    notificationData: { type: NotificationTypes; jobsId: number; customerId?: number },
  ) {
    //for문을 사용해 userIds array에 있는 userId를 순회하며 메시지 발송
    for (const userId of userIds) {
      const socketId = await this.redisConfig.getUserSocketId(userId);
      if (socketId) {
        this.server.to(socketId).emit("notification", notificationData);
      }
    }
  }
}
