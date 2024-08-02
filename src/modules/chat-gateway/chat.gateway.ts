import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "../chat/chat.service";
import { UseGuards } from "@nestjs/common";
import { JwtSocketGuards } from "../auth/strategies/jwt-strategy";
import { RequestJwtBySocket } from "src/common/customs/decorators/jwt-socket-request";
import { CreateChatDto } from "../chat/dto/create-chat.dto";
import { UpdateChatDto } from "../chat/dto/update-chat.dto";
import { RedisConfig } from "src/database/redis/redis.config";
import { UsersEntity } from "src/entities/users.entity";
import { Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { RequestJwtByHttp } from "src/common/customs/decorators/jwt-http-request";

// @UseGuards(JwtSocketGuards)
@WebSocketGateway({
  cors: {
    origin: "http://localhost:3000", // 클라이언트의 URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // 유저 정보를 레디스에 적재시키기 위해서 레디스 설정이 선행되야합니다. db와 상호작용을 위해 챗 서비스 의존성을 주입합니다.
  constructor(
    private readonly chatService: ChatService,
    private readonly redisConfig: RedisConfig,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService, // JwtService를 DI로 주입받음
    private readonly configService: ConfigService,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  // 유저정보는 같지만 소켓이 여러개가 연결되어 있을 경우 핸들링 할수있게 유저정보와 소켓 연결정보에 대한 분기처리가 필요하다.
  // 즉, 한명의 유저는 여러개의 채팅방에 소속되어 있을 수 있으므로, 그에 대한 각 사용자의 여러 소켓 연결을 관리하기위해 필요하다
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
      console.log(userId + "++++++++++++++++++++");
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
        console.error("Unexpected disconnect without valid user ID.");
      }
    } catch (error) {
      console.error("Error during disconnection:", error);
    }
  }

  // 내가 채팅하려는 상대방의 online, offline상태 확인
  @SubscribeMessage("getUserStatus")
  async getUserStatus(
    @MessageBody("receiverId") receiverId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const status = await this.redisConfig.getUserStatus(receiverId);
    const user = await this.usersRepository.findOne({ where: { id: receiverId } });
    if (!user) {
      client.emit("userStatusError", { error: "User not found" });
      return;
    }
    client.emit("userStatus", { receiverId, name: user.name, status });
  }

  // 내 상태를 online으로 변경
  @SubscribeMessage("setUserStatus")
  async setUserStatus(
    // @RequestJwtBySocket() { user: { id: userId } },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.getUserIdFromSocket(client);
    await this.redisConfig.setUserStatus(userId, "online");
    const user = await this.getUserById(userId);
    client.emit("userStatus", { userId, name: user.name, status: "online" });
  }

  // 내 상태를 offline으로 변경
  @SubscribeMessage("removeUserStatus")
  async removeUserStatus(
    // @RequestJwtBySocket() { user: { id: userId } },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.getUserIdFromSocket(client);
    await this.redisConfig.removeUserStatus(userId);
    const user = await this.getUserById(userId);
    client.emit("userStatus", { userId, name: user.name, status: "offline" });
  }

  // id를 기반으로 유저찾기
  private async getUserById(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  @SubscribeMessage("sendChat")
  async handleChat(
    // @RequestJwtBySocket() { user: { id: userId } },
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.getUserIdFromSocket(client);
    const { receiverId, content } = createChatDto;
    const newChat = await this.chatService.createChat(userId, createChatDto);
    console.log("++++++++++++++++++++" + newChat);
    client.to(newChat.chatRoomsId.toString()).emit("receiveChat", newChat);
  }

  @SubscribeMessage("updateChat")
  async handleUpdateChat(
    // @RequestJwtBySocket() { user: { id: userId } },
    @MessageBody() data: { chatRoomId: number; chatId: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.getUserIdFromSocket(client);
    const { chatRoomId, chatId, content } = data;
    const updatedChat = await this.chatService.updateChat(userId, chatRoomId, chatId, { content });
    client.to(chatRoomId.toString()).emit("chatUpdated", updatedChat);
  }

  @SubscribeMessage("deleteChat")
  async handleDeleteChat(
    // @RequestJwtBySocket() { user: { id: userId } },
    @MessageBody() data: { chatRoomId: number; chatId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.getUserIdFromSocket(client);
    const { chatRoomId, chatId } = data;
    await this.chatService.deleteChat(userId, chatRoomId, chatId);
    client.to(chatRoomId.toString()).emit("chatDeleted", { chatId });
  }

  @SubscribeMessage("joinRoom")
  async handleRoomJoin(
    @MessageBody() data: { receiverId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = this.getUserIdFromSocket(client);
    console.log("++++++++++++" + userId);

    // 채팅룸 생성 또는 조회
    const existingChatRoom = await this.chatService.findChatRoomByIds(userId, data.receiverId);

    let chatRoomId;
    if (!existingChatRoom) {
      // 새 채팅룸 생성
      const newChatRoom = await this.chatService.createChatRoom(userId, data.receiverId);
      chatRoomId = newChatRoom.id;
    } else {
      chatRoomId = existingChatRoom.id;
    }

    // 클라이언트 채팅룸 조인
    client.join(chatRoomId.toString());
    console.log(`User ${userId} joined room ${chatRoomId}`);
    // 채팅 로그 가져오기
    const chatLogs = await this.chatService.findChatLog(userId, chatRoomId);
    client.emit("chatLog", chatLogs); // 클라이언트에게 채팅 로그 전송
  }
}
