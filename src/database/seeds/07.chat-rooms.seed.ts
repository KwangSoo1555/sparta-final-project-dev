import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { ChatRoomsEntity } from "../../entities/chat-rooms.entity";
import { UsersEntity } from "../../entities/users.entity";
import { faker } from "@faker-js/faker";

export class ChatRoomSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(UsersEntity);
    const chatRoomRepository = dataSource.getRepository(ChatRoomsEntity);

    const users = await userRepository.find();
    const pairs = new Set<string>();
    const chatRooms: ChatRoomsEntity[] = [];

    for (let i = 0; i < 100; i++) {
      const [user1, user2] = faker.helpers.arrayElements(users, 2) as [UsersEntity, UsersEntity];
      const pairKey = `${user1.id}-${user2.id}`;
      const reversePairKey = `${user2.id}-${user1.id}`;

      if (!pairs.has(pairKey) && !pairs.has(reversePairKey)) {
        pairs.add(pairKey);
        const newChatRoom = chatRoomRepository.create({ user1Id: user1.id, user2Id: user2.id });
        chatRooms.push(newChatRoom);
      }
    }

    await chatRoomRepository.save(chatRooms);
  }
}