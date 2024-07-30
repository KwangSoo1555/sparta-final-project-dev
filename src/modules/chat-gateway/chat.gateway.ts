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

    // 새 채팅 메시지 생성 로직 (데이터베이스 저장 등)
    const newChat = await this.chatService.createChat(userId, createChatDto);

    // 메시지를 해당 수신자에게 실시간으로 전송
    client.to(receiverId.toString()).emit("receiveChat", newChat);
    this.server
      .to(receiverId.toString())
      .emit("newMessageAlert", { message: "새 메시지가 도착했습니다.", chat: newChat });
  }

  @SubscribeMessage("updateChat")
  async handleUpdateChat(
    @RequestJwt() { user: { id: userId } },
    @Param("chat_rooms_id") chatRoomId: number,
    @Param("chat_id") chatId: number,
    @MessageBody() updateChatDto: UpdateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { content } = updateChatDto;
    const updatedChat = await this.chatService.updateChat(userId, chatRoomId, chatId, { content });

    // 변경 사항을 실시간으로 전송
    client.to(chatRoomId.toString()).emit("chatUpdated", updatedChat);
  }

  @SubscribeMessage("deleteChat")
  async handleDeleteChat(
    @RequestJwt() { user: { id: userId } },
    @Param("chat_rooms_id") chatRoomId: number,
    @Param("chat_id") chatId: number,
    @MessageBody() data: { chatId: number; chatRoomId: number },
    @ConnectedSocket() client: Socket,
  ) {
    await this.chatService.deleteChat(userId, chatRoomId, chatId);

    // 삭제된 메시지 ID를 실시간으로 전송
    client.to(chatRoomId.toString()).emit("chatDeleted", { chatId });
  }

  // 클라이언트 연결 시 채팅룸 조인
  @SubscribeMessage("joinRoom")
  handleRoomJoin(@MessageBody() data: { userId: number }, @ConnectedSocket() client: Socket) {
    client.join(data.userId.toString()); // 사용자 ID를 기반으로 한 방에 조인
  }
}
