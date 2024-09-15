<<<<<<< HEAD
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { UsersEntity } from "./users.entity";
import { ChatsEntity } from "./chats.entity";

@Entity()
export class ChatRoomsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user1_id" })
  user1Id: number;

  @Column({ name: "user2_id" })
  user2Id: number;

  @ManyToOne(() => UsersEntity, (users) => users.user1InChatRoom)
  @JoinColumn({ name: "user1_id" })
  user1: UsersEntity;

  @ManyToOne(() => UsersEntity, (users) => users.user2InChatRoom)
  @JoinColumn({ name: "user2_id" })
  user2: UsersEntity;

  @OneToMany(() => ChatsEntity, (chats) => chats.chatRoomsEntity)
  chatsEntity: ChatsEntity[];
}
=======
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { UsersEntity } from "./users.entity";
import { ChatsEntity } from "./chats.entity";

@Entity()
export class ChatRoomsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user1_id" })
  user1Id: number;

  @Column({ name: "user2_id" })
  user2Id: number;

  @ManyToOne(() => UsersEntity, (users) => users.user1InChatRoom)
  @JoinColumn({ name: "user1_id" })
  user1: UsersEntity;

  @ManyToOne(() => UsersEntity, (users) => users.user2InChatRoom)
  @JoinColumn({ name: "user2_id" })
  user2: UsersEntity;

  @OneToMany(() => ChatsEntity, (chats) => chats.chatRoomsEntity)
  chatsEntity: ChatsEntity[];
}
>>>>>>> a79eb53a78d8df92a45067b66b6d3f4ae2ab1a5d
