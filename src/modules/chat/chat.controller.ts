import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { CreateChatDto } from "./dto/create-chat.dto";
import { JwtAccessGuards } from "../auth/common/jwt/jwt-strategy.service";
import { RequestJwt } from "src/common/customs/decorator/jwt-request";
import { UsersEntity } from "src/entities/users.entity";
import { UpdateChatDto } from "./dto/update-chat.dto";

@UseGuards(JwtAccessGuards)
@Controller("/chat-rooms")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 채팅및 채팅룸 생성 api
  @Post()
  async createChat(@RequestJwt() { user: { id: userId } }, @Body() createChatDto: CreateChatDto) {
    const createChat = this.chatService.createChat(userId, createChatDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: "채팅을 성공적으로 보냈습니다.",
      createChat,
    };
  }

  // 채팅룸 목록 조회 api
  @Get()
  async findAllChatRooms(@RequestJwt() user: UsersEntity) {
    const findAllChatRooms = this.chatService.findAllChatRooms(user.id);
    return {
      statusCode: HttpStatus.OK,
      message: "채팅룸 목록 조회 성공",
      findAllChatRooms,
    };
  }

  // 채팅로그 조회 api
  @Get(":/chat-rooms-id")
  async findChatLogs(
    @RequestJwt() user: UsersEntity,
    @Param("chatRoomId")
    chatRoomId: number,
  ) {
    const findChatLogs = this.chatService.findChatLog(user.id, chatRoomId);

    return {
      statusCode: HttpStatus.OK,
      message: "성공적으로 채팅방에 입장",
      findChatLogs,
    };
  }

  // 채팅 수정 api
  @Patch("/:chat-rooms-id/chats/:chat-id")
  async updateChat(
    @RequestJwt() user: UsersEntity,
    @Param("chatRoomId") chatRoomId: number,
    @Param("chatId") chatId: number,
    @Body() updateChatDto: UpdateChatDto,
  ) {
    const updateChat = this.chatService.updateChat(user.id, chatRoomId, chatId, updateChatDto);

    return {
      statusCode: HttpStatus.OK,
      message: "채팅 수정 성공",
      updateChat,
    };
  }

  // 채팅 삭제 api
  @Delete("/:chat-rooms-id/chats/:chat-id")
  async deleteChat(
    @RequestJwt() user: UsersEntity,
    @Param("chatRoomId") chatRoomId: number,
    @Param("chatId") chatId: number,
  ) {
    const deleteChat = this.chatService.deleteChat(user.id, chatRoomId, chatId);

    return {
      statusCode: HttpStatus.OK,
      message: "채팅 삭제 성공",
      deleteChat,
    };
  }
}
