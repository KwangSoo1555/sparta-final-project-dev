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
import { ChatGateway } from "src/modules/chat-gateway/chat.gateway";
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
    // private readonly notificationsService: NotificationsService,
    private readonly redisConfig: RedisConfig,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly chatGateway: ChatGateway,
  ) {}

  private connectedClients = [];

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const userId = this.chatGateway.getUserIdFromSocket(client);
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
      const userId = this.chatGateway.getUserIdFromSocket(client);
      if (userId) {
        //redisClient로 redisClient enstance를 가져옴 - del 사용하기 위해
        const redisClient = this.redisConfig.getClient();
        //del을 이용해 redis에서 socketId를 삭제 - 이유 : redisConfig로 호출 시 에러 발생
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

  //notificationData = 내가 알림을 보낼 내용
  async sendJobMatchingNotification(
    userId: number,
    notificationData: { type: NotificationTypes; jobsId: number; title: string },
  ) {
    const socketId = await this.redisConfig.getUserSocketId(userId);
    console.log("socket ID : ", socketId);
    if (socketId) {
      this.chatGateway.server.to(socketId).emit("notification", notificationData);
    }
  }
}
