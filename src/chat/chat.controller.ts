import { Controller, Get, HttpStatus, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { CreateChatDto } from "./dto/create-chat.dto";

@Controller("/chat-rooms")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // // 채팅및 채팅룸 생성 api
  // @Post()
  // async createChat(@Body() createChatDto: CreateChatDto) {
  //   const createChat = this.chatService.createChat(user.id, createChatDto);

  //   return {
  //     statusCode: HttpStatus.CREATED,
  //     message: "채팅을 성공적으로 보냈습니다.",
  //     createChat,
  //   };
  // }

  // // 채팅룸 조회
  // @Get()
  // async findAllChatRooms() {
  //   const findAllChatRooms = this.chatService.findAllChatRooms(user.id);
  //   return {
  //     statusCode: HttpStatus.OK,
  //     message: "카드목록 조회 성공",
  //     findAllChatRooms,
  //   };
  // }
}
