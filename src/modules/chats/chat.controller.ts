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
import { JwtAccessGuards } from "src/modules/auth/strategies/jwt-strategy";
import { RequestJwtByHttp } from "src/common/customs/decorators/jwt-http-request";
import { UsersEntity } from "src/entities/users.entity";
import { UpdateChatDto } from "./dto/update-chat.dto";

@UseGuards(JwtAccessGuards)
@Controller("chat-rooms")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // 채팅로그 조회 api
  @Get("chatlog/:chat_rooms_id")
  async findChatLogs(
    @RequestJwtByHttp() { user: { id: userId } },
    @Param("chat_rooms_id")
    chatRoomId: number,
  ) {
    const findChatLogs = await this.chatService.findChatLog(userId, chatRoomId);

    return {
      statusCode: HttpStatus.OK,
      message: "성공적으로 채팅방에 입장",
      data: findChatLogs,
    };
  }

  // 채팅및 채팅룸 생성 api
  @Post()
  async createChat(@RequestJwtByHttp() { user: { id: userId } }, @Body() createChatDto: CreateChatDto) {
    const createChat = await this.chatService.createChat(userId, createChatDto);

    return {
      statusCode: HttpStatus.CREATED,
      message: "채팅을 성공적으로 보냈습니다.",
      data: createChat,
    };
  }

  // 채팅룸 목록 조회 api
  @Get()
  async findAllChatRooms(@RequestJwtByHttp() { user: { id: userId } }) {
    const findAllChatRooms = await this.chatService.findAllChatRooms(userId);
    return {
      statusCode: HttpStatus.OK,
      message: "카드목록 조회 성공",
      findAllChatRooms,
    };
  }

  // 채팅 수정 api
  @Patch("/:chat_rooms_id/chats/:chat_id")
  async updateChat(
    @RequestJwtByHttp() { user: { id: userId } },
    @Param("chat_rooms_id") chatRoomId: number,
    @Param("chat_id") chatId: number,
    @Body() updateChatDto: UpdateChatDto,
  ) {
    const updateChat = await this.chatService.updateChat(userId, chatRoomId, chatId, updateChatDto);

    return {
      statusCode: HttpStatus.OK,
      message: "채팅 수정 성공",
      data: updateChat,
    };
  }

  // 채팅 삭제 api
  @Delete("/:chat_rooms_id/chats/:chat_id")
  async deleteChat(
    @RequestJwtByHttp() { user: { id: userId } },
    @Param("chat_rooms_id") chatRoomId: number,
    @Param("chat_id") chatId: number,
  ) {
    const deleteChat = await this.chatService.deleteChat(userId, chatRoomId, chatId);

    return {
      statusCode: HttpStatus.OK,
      message: "채팅 삭제 성공",
    };
  }
}
