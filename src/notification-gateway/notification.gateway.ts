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
        await this.redisConfig.setUserStatus(userId, "online");
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
        await this.redisConfig.removeUserStatus(userId);
        this.connectedClients = this.connectedClients.filter((c) => c.client !== client);
        console.log(`User ${userId} disconnected`);
      } else {
        console.error("Unexpected disconnect without valid user Id");
      }
    } catch (error) {
      console.error("Error during disconnection:", error);
    }
  }
  //클라이언트에서 notification 이벤트를 보내야 동작
  @SubscribeMessage("notification")
  async handleNotification(client: Socket, createNotificationDto: CreateNotificationDto) {
    const userId = this.getUserIdFromSocket(client);
    if (!userId) {
      client.emit("error", { message: "Unauthorized User" });
      return;
    }

    try {
      createNotificationDto.userIds.push(userId);
      await this.notificationsService.createNotificationMessage(createNotificationDto);

      client.emit("notification succeed", { message: "notification sent" });
    } catch (error) {
      client.emit("notification Failed", { message: "Failed notification" });
    }
  }
}
