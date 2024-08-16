import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Brackets, Repository } from "typeorm";
import { UsersEntity } from "src/entities/users.entity";
import { ChatsEntity } from "src/entities/chats.entity";
import { ChatRoomsEntity } from "src/entities/chat-rooms.entity";
import { CreateChatDto } from "./dto/create-chat.dto";
import { UpdateChatDto } from "./dto/update-chat.dto";
import { RedisConfig } from "src/database/redis/redis.config";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatsEntity)
    private readonly chatsRepository: Repository<ChatsEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(ChatRoomsEntity)
    private readonly chatRoomsRepository: Repository<ChatRoomsEntity>,
    private readonly redisConfig: RedisConfig, // RedisConfig 주입
  ) {}

  // 두 사용자 간의 채팅룸을 생성
  async createChatRoom(user1Id: number, user2Id: number) {
    // 채팅룸 생성
    const newChatRoom = this.chatRoomsRepository.create({
      user1Id: user1Id,
      user2Id: user2Id,
    });

    // 채팅룸 저장
    await this.chatRoomsRepository.save(newChatRoom);

    return newChatRoom;
  }

  // Redis에 채팅 메시지 저장
  async saveChatToRedis(chatRoomId: number, chatData: any) {
    const redisClient = this.redisConfig.getClient();
    await redisClient.lpush(`chatRoom:${chatRoomId}`, JSON.stringify(chatData));
  }

  // 채팅 및 채팅룸 생성 후 redis에 저장하는 메서드
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

    // Redis에 채팅 데이터 저장
    const newChat = {
      senderId: userId,
      receiverId: receiverId,
      chatRoomsId: chatRoomId,
      content: content,
      createdAt: new Date(),
    };
    await this.saveChatToRedis(chatRoomId, newChat);

    return newChat;
  }

  // 스케쥴러를 이용해서 3분마다 레디스와 db를 연동시키기
  @Cron("*/3 * * * *") // 3분마다 실행
  async syncRedisToDB() {
    const redisClient = this.redisConfig.getClient();
    const keys = await redisClient.keys("chatRoom:*");

    for (const key of keys) {
      const chatRoomId = key.split(":")[1];
      const chatLogs = await redisClient.lrange(key, 0, -1);

      for (const log of chatLogs) {
        const chatData = JSON.parse(log);
        await this.chatsRepository.save(chatData);
      }

      // 동기화된 후 Redis에서 해당 키 삭제
      await redisClient.del(key);
    }
  }

  // redis와 db를 모두 고려해서 채팅룸 목록 조회
  async findAllChatRooms(userId: number) {
    const redisClient = this.redisConfig.getClient();

    const chatRooms = await this.chatRoomsRepository
      .createQueryBuilder("chat_room")
      .select(["chat_room.id", "chat_room.user1Id", "chat_room.user2Id"])
      .where(
        new Brackets((qb) => {
          qb.where("chat_room.user1Id = :userId", { userId }).orWhere(
            "chat_room.user2Id = :userId",
            { userId },
          );
        }),
      )
      .getMany();

    const chatRoomDetails = await Promise.all(
      chatRooms.map(async (room) => {
        const receiverId = room.user1Id === userId ? room.user2Id : room.user1Id;
        const receiver = await this.usersRepository.findOne({
          select: { name: true },
          where: { id: receiverId },
        });

        const redisKey = `chatRoom:${room.id}`;
        const redisLastMessage = await redisClient.lindex(redisKey, 0);

        let lastMessage;
        let lastMessageTime;

        if (redisLastMessage) {
          const redisMessageData = JSON.parse(redisLastMessage);
          lastMessage = redisMessageData.content;
          lastMessageTime = new Date(redisMessageData.createdAt);
        } else {
          const dbLastMessage = await this.chatsRepository.findOne({
            where: { chatRoomsId: room.id },
            order: { createdAt: "DESC" },
            select: ["content", "createdAt"],
          });

          if (!dbLastMessage) {
            lastMessage = null;
            lastMessageTime = null;
          } else {
            lastMessage = dbLastMessage.content;
            lastMessageTime = dbLastMessage.createdAt;
          }
        }

        return {
          roomId: room.id,
          receiverId: receiverId,
          receiverName: receiver.name,
          lastMessage,
          lastMessageTime,
        };
      }),
    );

    const sortedChatRoomDetails = chatRoomDetails.sort((a, b) => {
      if (a.lastMessageTime === null) return 1;
      if (b.lastMessageTime === null) return -1;
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    });

    return sortedChatRoomDetails;
  }

  // redis와 db를 모두 고려해서 채팅 로그 조회
  async findChatLog(userId: number, chatRoomId: number) {
    const checkUser = await this.findAllChatRooms(userId);

    if (!checkUser) {
      throw new UnauthorizedException("이 채팅방에 접근 권한이 없습니다.");
    }

    const redisClient = this.redisConfig.getClient();

    // Redis에서 채팅 로그 가져오기
    const redisChatLogs = await redisClient.lrange(`chatRoom:${chatRoomId}`, 0, -1);
    const redisChatLogsParsed = redisChatLogs.map((log) => JSON.parse(log));

    // DB에서 채팅 로그 가져오기
    const dbChatLogs = await this.chatsRepository
      .createQueryBuilder("chats")
      .select([
        "chats.id",
        "chats.senderId",
        "chats.receiverId",
        "chats.content",
        "chats.createdAt",
      ])
      .where("chats.chatRoomsId = :chatRoomId", { chatRoomId })
      .orderBy("chats.createdAt", "ASC")
      .getMany();

    // Redis와 DB에서 가져온 로그를 합치기
    const allChatLogs = [...redisChatLogsParsed, ...dbChatLogs];

    // createdAt 순으로 정렬
    const sortedChatLogs = allChatLogs.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );

    // 추가 정보와 함께 반환
    const chatLogsDetails = await Promise.all(
      sortedChatLogs.map(async (chat) => {
        const receiver = await this.usersRepository.findOne({
          select: ["name"],
          where: { id: chat.receiverId },
        });

        const sender = await this.usersRepository.findOne({
          select: ["name"],
          where: { id: chat.senderId },
        });

        return {
          chatId: chat.id,
          senderId: chat.senderId,
          senderName: sender?.name || "Unknown",
          receiverId: chat.receiverId,
          receiverName: receiver?.name || "Unknown",
          content: chat.content,
          createdAt: chat.createdAt,
        };
      }),
    );

    return chatLogsDetails;
  }

  // 동기화 되지 않고 redis에 저장된 채팅인지 db에 동기화가 진행 된 채팅인지 확인 한 뒤 각각의 상황에 맞게 채팅 수정.
  async updateChat(
    userId: number,
    chatRoomId: number,
    chatId: number,
    updateChatDto: UpdateChatDto,
  ) {
    const redisClient = this.redisConfig.getClient();
    const { content } = updateChatDto;

    // Redis에서 데이터가 있는지 확인
    const redisKey = `chatRoom:${chatRoomId}`;
    const chatLogs = await redisClient.lrange(redisKey, 0, -1);
    let chatFoundInRedis = false;

    for (let i = 0; i < chatLogs.length; i++) {
      const chatData = JSON.parse(chatLogs[i]);

      if (chatData.id === chatId) {
        // Redis에서 해당 채팅을 업데이트
        chatData.content = content;
        chatLogs[i] = JSON.stringify(chatData);
        chatFoundInRedis = true;
        break;
      }
    }

    if (chatFoundInRedis) {
      // Redis에 업데이트된 채팅 저장
      await redisClient.del(redisKey); // 기존 데이터 삭제
      await redisClient.rpush(redisKey, ...chatLogs); // 업데이트된 데이터 추가
    } else {
      // DB에 있는지 확인
      const chat = await this.findChatById(chatId);

      if (!chat || chat.chatRoomsId !== +chatRoomId) {
        throw new UnauthorizedException("채팅룸 매치 안됨");
      }

      if (chat.senderId !== userId) {
        throw new UnauthorizedException("사용자 id 매치 안됨");
      }

      // DB에서 채팅 업데이트
      await this.chatsRepository.update({ id: chatId }, { content });
    }

    // 수정된 채팅 반환
    const updatedChat = chatFoundInRedis
      ? JSON.parse(chatLogs.find((chat) => JSON.parse(chat).id === chatId))
      : await this.findChatById(chatId);

    return updatedChat;
  }

  // redis에 저장된 채팅인지 db에 동기화가 완료된 채팅인지 확인 후 채팅삭제
  async deleteChat(userId: number, chatRoomId: number, chatId: number) {
    const redisClient = this.redisConfig.getClient();

    // Redis에서 데이터가 있는지 확인
    const redisKey = `chatRoom:${chatRoomId}`;
    const chatLogs = await redisClient.lrange(redisKey, 0, -1);
    let chatFoundInRedis = false;

    // Redis에서 해당 채팅 삭제
    for (let i = 0; i < chatLogs.length; i++) {
      const chatData = JSON.parse(chatLogs[i]);

      if (chatData.id === chatId) {
        chatLogs.splice(i, 1); // 배열에서 해당 채팅 제거
        chatFoundInRedis = true;
        break;
      }
    }

    if (chatFoundInRedis) {
      // Redis에 업데이트된 채팅 로그 저장
      await redisClient.del(redisKey); // 기존 데이터 삭제
      if (chatLogs.length > 0) {
        await redisClient.rpush(redisKey, ...chatLogs); // 남아있는 데이터 추가
      }
    } else {
      // DB에서 삭제
      const chat = await this.findChatById(chatId);

      if (!chat || chat.chatRoomsId !== +chatRoomId || chat.senderId !== userId) {
        throw new UnauthorizedException("채팅을 삭제할 권한이 없습니다.");
      }

      await this.chatsRepository.softDelete({ id: chatId });
    }

    return { success: true };
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
