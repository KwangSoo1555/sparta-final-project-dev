import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { ChatsEntity } from "../../entities/chats.entity";
import { ChatRoomsEntity } from "../../entities/chat-rooms.entity";
import { faker } from "@faker-js/faker";

export class ChatSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const chatRepo = dataSource.getRepository(ChatsEntity);
    const chatRoomRepo = dataSource.getRepository(ChatRoomsEntity);

    const chatRooms = await chatRoomRepo.find({ relations: ['user1', 'user2'] });
    const chats: ChatsEntity[] = [];

    for (const chatRoom of chatRooms) {
      const chatCount = faker.number.int({ min: 5, max: 10 });

      for (let i = 0; i < chatCount; i++) {
        const isUser1Sender = faker.datatype.boolean();
        const sender = isUser1Sender ? chatRoom.user1 : chatRoom.user2;
        const receiver = isUser1Sender ? chatRoom.user2 : chatRoom.user1;

        const chat = chatRepo.create({
          senderId: sender.id,
          receiverId: receiver.id,
          chatRoomsId: chatRoom.id,
          content: faker.lorem.sentence(),
          createdAt: faker.date.past(),
        });

        chats.push(chat);
      }
    }
    await chatRepo.save(chats);
  }
}