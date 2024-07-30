import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ChatService } from "../chat/chat.service";
import { Param, UseGuards } from "@nestjs/common";
import { JwtAccessGuards } from "../auth/strategies/jwt-strategy";
import { RequestJwt } from "src/common/customs/decorators/jwt-request";
import { CreateChatDto } from "../chat/dto/create-chat.dto";
import { UpdateChatDto } from "../chat/dto/update-chat.dto";

@UseGuards(JwtAccessGuards)
@WebSocketGateway()
export class ChatGateway {
  constructor(private readonly chatService: ChatService) {}
  @WebSocketServer()
  server: Server;

  @SubscribeMessage("sendChat")
  async handleChat(
    @RequestJwt() { user: { id: userId } },
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { receiverId, content } = createChatDto;
    const newChat = await this.chatService.createChat(userId, createChatDto);
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
