import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToOne,
  OneToMany,
} from "typeorm";

import { RefreshTokensEntity } from "./refresh-tokens.entity";
import { JobsEntity } from "./jobs.entity";
import { JobsMatchingEntity } from "./jobs-matching.entity";
import { ChatRoomsEntity } from "./chat-rooms.entity";
import { ChatsEntity } from "./chats.entity";
import { ReportsEntity } from "./reports.entity";
import { BlacklistsEntity } from "./blacklists.entity";
import { NoticesEntity } from "./notices.entity";

import { SocialProviders } from "../common/customs/enums/enum-social-providers";
import { UserRoles } from "../common/customs/enums/enum-user-roles";

@Entity("users")
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * @example user1@example.com
   */
  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ type: "enum", enum: UserRoles, default: UserRoles.USER })
  role: UserRoles;

  @Column({ name: "social_id", default: null })
  socialId: string;

  @Column({ type: "enum", enum: SocialProviders, default: SocialProviders.LOCAL })
  provider: SocialProviders;

  @Column({
    name: "img_url",
    default:
      "https://i.namu.wiki/i/Bbq0E9hXYyrXbL4TnIE__vtQ2QwiZ3i40NZSLiX_a6S0ftYCndVZjf4vlruWur4I3Z0o7CZuFrRMl2CKxyk30w.webp",
  })
  imgUrl: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", default: null })
  deletedAt: Date;

  @OneToOne(() => RefreshTokensEntity, (refreshToken) => refreshToken.user)
  refreshToken: RefreshTokensEntity;

  @OneToMany(() => ReportsEntity, (report) => report.reporter)
  reporter: ReportsEntity[];

  @OneToMany(() => ReportsEntity, (report) => report.reported)
  reported: ReportsEntity[];

  @OneToMany(() => NoticesEntity, (notices) => notices.user)
  notices: NoticesEntity[];

  @OneToMany(() => ChatsEntity, (chats) => chats.chatSender)
  chatsSender: ChatsEntity[];

  @OneToMany(() => ChatsEntity, (chats) => chats.chatSender)
  chatsReciever: ChatsEntity[];

  @OneToMany(() => BlacklistsEntity, (black) => black.user)
  blacklists: BlacklistsEntity[];

  @OneToMany(() => BlacklistsEntity, (black) => black.blackedUser)
  blackedUser: BlacklistsEntity[];

  @OneToMany(() => ChatRoomsEntity, (chatRoom) => chatRoom.user1)
  user1InChatRoom: ChatRoomsEntity[];

  @OneToMany(() => ChatRoomsEntity, (chatRoom) => chatRoom.user2)
  user2InChatRoom: ChatRoomsEntity[];

  @OneToMany(() => JobsEntity, (job) => job.usersEntity)
  jobs: JobsEntity[];

  @OneToMany(() => JobsMatchingEntity, (jobsMatching) => jobsMatching.users)
  jobsMatching: JobsMatchingEntity[];
}
