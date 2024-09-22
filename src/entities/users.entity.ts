import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Field, ObjectType, ID } from "@nestjs/graphql";

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
import { NotificationLogsEntity } from "./notification-logs.entity";
import { NotificationMessagesEntity } from "./notification-messages.entity";
import { UsersLocalCodesEntity } from "./users-localcodes.entity";

@Entity("users")
@ObjectType()
export class UsersEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: "유저 아이디" })
  id: number;

  @Column({ unique: true })
  @Index("user_email_index", { unique: true })
  @Field(() => String, { description: "유저 이메일" })
  email: string;

  @Column()
  @Field(() => String, { description: "유저 이름" })
  name: string;

  @Column({ nullable: true })
  @Field(() => String, { description: "유저 비밀번호" })
  password: string;

  @Column({ type: "enum", enum: UserRoles, default: UserRoles.USER })
  @Field(() => UserRoles, { description: "유저 등급 (USER, ADMIN)" })
  role: UserRoles;

  @Column({ name: "social_id", default: null })
  @Field(() => String, { description: "소셜 아이디" })
  socialId: string;

  @Column({ type: "enum", enum: SocialProviders, default: SocialProviders.LOCAL })
  @Field(() => SocialProviders, { description: "소셜 플랫폼 (LOCAL, GOOGLE, KAKAO, NAVER)" })
  provider: SocialProviders;

  @Column({
    name: "img_url",
    default:
      "https://i.namu.wiki/i/Bbq0E9hXYyrXbL4TnIE__vtQ2QwiZ3i40NZSLiX_a6S0ftYCndVZjf4vlruWur4I3Z0o7CZuFrRMl2CKxyk30w.webp",
  })
  @Field(() => String, { description: "유저 프로필 이미지" })
  imgUrl: string;

  @CreateDateColumn({ name: "created_at" })
  @Field(() => Date, { description: "유저 생성 일자" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  @Field(() => Date, { description: "유저 업데이트 일자" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "deleted_at", default: null })
  @Field(() => Date, { description: "유저 삭제 일자" })
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

  @OneToMany(() => NotificationLogsEntity, (notificationLogs) => notificationLogs.user)
  notificationLogs: NotificationLogsEntity[];

  @ManyToOne(() => NotificationMessagesEntity, (notificationMessage) => notificationMessage.users)
  @JoinColumn({ name: "notification_messages" })
  notificationMessage: NotificationMessagesEntity;

  @OneToMany(() => UsersLocalCodesEntity, (usersLocalCodes) => usersLocalCodes.user)
  usersLocalCodes: UsersLocalCodesEntity[];
}
