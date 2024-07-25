import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { UsersEntity } from "src/entities/users.entity";
import { ChatsEntity } from "src/entities/chats.entity";
import { ChatRoomsEntity } from "src/entities/chat-rooms.entity";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatsEntity)
    private readonly chatsRepository: Repository<ChatsEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(ChatRoomsEntity)
    private readonly chatRoomsRepository: Repository<ChatRoomsEntity>,
  ) {}

  // 채팅 및 채팅룸 생성
  async createChat(userId: number, createChatDto: CreateChatDto) {
    const { receiverId, content } = createChatDto;

    if (userId === receiverId) {
      throw new Error("자기자신에게 메시지를 보낼 수 없습니다.");
    }

    // 받는 사람이 존재하는지 확인
    const receiver = await this.findReceiverById(receiverId);
    if (!receiver) {
      throw new NotFoundException("받는 사람이 존재하지 않습니다.");
    }

    // 채팅 룸 존재하는지 검색
    const existingChatRoom = await this.findChatRoomByIds(userId, receiverId);

    let chatRoomId;

    if (!existingChatRoom) {
      // 새 채팅룸 생성: 데이터베이스에 채팅룸 저장
      const newChatRoom = this.chatRoomsRepository.create({
        user1Id: userId,
        user2Id: receiverId,
      });
      await this.chatRoomsRepository.save(newChatRoom);
      chatRoomId = newChatRoom.id;
    } else {
      chatRoomId = existingChatRoom.id;
    }

    // 새 채팅 메시지 생성 후 저장
    const newChat = this.chatsRepository.create({
      senderId: userId,
      receiverId: receiverId,
      chatRoomsId: chatRoomId,
      content: content,
    });

    await this.chatsRepository.save(newChat);

    return newChat;
  }

  // 채팅룸 목록 조회
  async findAllChatRooms(userId: number) {
    const chatRoom = this.chatRoomsRepository
      .createQueryBuilder("chat_room")
      .select("chat_room.id")
      .where(
        new Brackets((qb) => {
          qb.where("chat_room.user1Id = :userId", {
            userId,
          }).orWhere("chat_room.user2Id = :userId", {
            userId,
          });
        }),
      )
      .getMany();

    return chatRoom;
  }

  // 채팅 로그 조회
  async findChatLog(userId: number, chatRoomId: number) {
    const checkUser = this.findAllChatRooms(userId);

    if (!checkUser) {
      throw new UnauthorizedException("이 채팅방에 접근 권한이 없습니다.");
    }

    const chatLogs = this.chatsRepository
      .createQueryBuilder("chats")
      .select(["chats.id", "chats.senderId", "chats.content", "chats.createdAt"])
      .where("chats.chatRoomsId = :chatRoomId", {
        chatRoomId,
      })
      .orderBy("chats.createdAt", "ASC")
      .getMany();

    return chatLogs;
  }

  // 채팅수정
  async updateChat(
    userId: number,
    chatRoomId: number,
    chatId: number,
    updateChatDto: UpdateChatDto,
  ) {
    const chat = await this.findChatById(chatId);

    if (chat.chatRoomsId !== +chatRoomId) {
      throw new UnauthorizedException("채팅룸 매치 안됨");
    }

    if (chat.senderId !== userId) {
      throw new UnauthorizedException("사용자 id 매치 안됨");
    }

    const { content } = updateChatDto;

    await this.chatsRepository.update({ id: chatId }, { content });

    const updatedChat = await this.findChatById(chatId);

    return updatedChat;
  }

  // 채팅삭제
  async deleteChat(userId: number, chatRoomId: number, chatId: number) {
    const chat = await this.findChatById(chatId);
    if (chat.chatRoomsId !== +chatRoomId || chat.senderId !== userId) {
      throw new Error("뭔가 뭔가 이상함");
    }

    return this.chatsRepository.softDelete({ id: chatId });
  }

  // 토큰으로 받은 userId와 receiverId를 통해 두명이 소속되어있는 채팅룸이 있는지 확인하는 메서드
  async findChatRoomByIds(userId: number, receiverId: number) {
    return this.chatRoomsRepository
      .createQueryBuilder("chat_room")
      .where(
        new Brackets((qb) => {
          qb.where("chat_room.user1Id = :userId AND chat_room.user2Id = :receiverId", {
            userId,
            receiverId,
          }).orWhere("chat_room.user1Id = :receiverId AND chat_room.user2Id = :userId", {
            userId,
            receiverId,
          });
        }),
      )
      .getOne();
  }

  // 받는 사람이 존재하는지 찾아보는 메서드
  async findReceiverById(receiverId: number) {
    return this.usersRepository.findOne({ where: { id: receiverId } });
  }

  // 채팅이 존재하는지 찾아보는 메서드
  async findChatById(chatId: number) {
    return this.chatsRepository.findOne({ where: { id: chatId } });
  }
}
