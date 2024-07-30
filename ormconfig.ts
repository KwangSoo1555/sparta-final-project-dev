import "dotenv/config";
import { DataSource } from "typeorm";
import { UsersEntity } from "./src/entities/users.entity";
import { RefreshTokensEntity } from "./src/entities/refresh-tokens.entity";
import { ReportsEntity } from "./src/entities/reports.entity";
import { NotificationsEntity } from "./src/entities/notifications.entity";
import { NoticesEntity } from "./src/entities/notices.entity";
import { JobsEntity } from "./src/entities/jobs.entity";
import { JobsMatchingEntity } from "./src/entities/jobs-matching.entity";
import { ChatRoomsEntity } from "./src/entities/chat-rooms.entity";
import { BlacklistsEntity } from "./src/entities/blacklists.entity";
import { ChatsEntity } from "./src/entities/chats.entity";

export const config = new DataSource({
  type: "mysql",
  url: process.env.MYSQL_URI,
  entities: [
    UsersEntity,
    RefreshTokensEntity,
    ReportsEntity,
    NotificationsEntity,
    NoticesEntity,
    JobsEntity,
    JobsMatchingEntity,
    ChatsEntity,
    ChatRoomsEntity,
    BlacklistsEntity,
  ],
  synchronize: true,
  logging: true,
});
