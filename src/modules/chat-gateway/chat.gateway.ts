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
import { Param, UseGuards } from "@nestjs/common";
import { AccessTokenStrategy, JwtAccessGuards } from "../auth/strategies/jwt-strategy";
import { RequestJwt } from "src/common/customs/decorators/jwt-request";
import { CreateChatDto } from "../chat/dto/create-chat.dto";
import { UpdateChatDto } from "../chat/dto/update-chat.dto";
import { RedisConfig } from "src/database/redis/redis.config";
import { UsersService } from "../users/users.service";
import { UsersEntity } from "src/entities/users.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@UseGuards(JwtAccessGuards)
@WebSocketGateway(4000, { cors: { origin: "localhost:3000" }, namespace: "chat" })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  // 유저 정보를 레디스에 적재시키기 위해서 레디스 설정이 선행되야합니다. db와 상호작용을 위해 챗 서비스 의존성을 주입합니다.
  constructor(
    private readonly chatService: ChatService,
    private readonly redisConfig: RedisConfig,
    private readonly accessTokenStrategy: AccessTokenStrategy,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  // 유저정보는 같지만 소켓이 여러개가 연결되어 있을 경우 핸들링 할수있게 유저정보와 소켓 연결정보에 대한 분기처리가 필요하다.
  // 즉, 한명의 유저는 여러개의 채팅방에 소속되어 있을 수 있으므로, 그에 대한 각 사용자의 여러 소켓 연결을 관리하기위해 필요하다
  private connectedClients = [];

  @WebSocketServer()
  server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    const token = client.handshake.auth.token;
    const payload = this.accessTokenStrategy.validate(token);
    const userId = (await payload).id;

    if (userId) {
      await this.redisConfig.setUserStatus(userId, "online");
      this.connectedClients.push({ userId, client });
      console.log(`User ${userId} connected with socket ID ${client.id}`);
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const token = client.handshake.auth.token;
    const payload = this.accessTokenStrategy.validate(token);
    const userId = (await payload).id;

    if (userId) {
      await this.redisConfig.setUserStatus(userId, "offline");
      this.connectedClients = this.connectedClients.filter((c) => c.client !== client);
      console.log(`User ${userId} disconnected`);
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
  async setUserStatus(@RequestJwt() { user: { id: userId } }, @ConnectedSocket() client: Socket) {
    await this.redisConfig.setUserStatus(userId, "online");
    const user = await this.getUserById(userId);
    client.emit("userStatus", { userId, name: user.name, status: "online" });
  }

  // 내 상태를 offline으로 변경
  @SubscribeMessage("removeUserStatus")
  async removeUserStatus(
    @RequestJwt() { user: { id: userId } },
    @ConnectedSocket() client: Socket,
  ) {
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
    @RequestJwt() { user: { id: userId } },
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { receiverId, content } = createChatDto;
    const newChat = await this.chatService.createChat(userId, createChatDto);
    console.log("++++++++++++++++++++" + newChat);
    client.to(receiverId.toString()).emit("receiveChat", newChat);
  }

  @SubscribeMessage("updateChat")
  async handleUpdateChat(
    @RequestJwt() { user: { id: userId } },
    @MessageBody() data: { chatRoomId: number; chatId: number; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { chatRoomId, chatId, content } = data;
    const updatedChat = await this.chatService.updateChat(userId, chatRoomId, chatId, { content });
    client.to(chatRoomId.toString()).emit("chatUpdated", updatedChat);
  }

  @SubscribeMessage("deleteChat")
  async handleDeleteChat(
    @RequestJwt() { user: { id: userId } },
    @MessageBody() data: { chatRoomId: number; chatId: number },
    @ConnectedSocket() client: Socket,
  ) {
    const { chatRoomId, chatId } = data;
    await this.chatService.deleteChat(userId, chatRoomId, chatId);
    client.to(chatRoomId.toString()).emit("chatDeleted", { chatId });
  }

  // 클라이언트 연결 시 채팅룸 조인
  @SubscribeMessage("joinRoom")
  handleRoomJoin(@MessageBody() data: { userId: number }, @ConnectedSocket() client: Socket) {
    client.join(data.userId.toString()); // 사용자 ID를 기반으로 한 방에 조인
  }
}
