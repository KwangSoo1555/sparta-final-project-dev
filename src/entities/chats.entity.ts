import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { UsersEntity } from "./users.entity";
import { ChatRoomsEntity } from "./chat-rooms.entity";

@Entity("chats")
export class ChatsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "sender_id" })
  senderId: number;

  @Column({ name: "receiver_id" })
  receiverId: number;

  @Column({ name: "chatRooms_id" })
  chatRoomsId: number;

  @Column()
  content: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "delete_at", default: null })
  deletedAt: Date;

  @ManyToOne(() => UsersEntity, (user) => user.chatsSender)
  @JoinColumn({ name: "sender_id" })
  chatSender: UsersEntity;

  @ManyToOne(() => UsersEntity, (users) => users.chatsReciever)
  @JoinColumn({ name: "receiver_id" })
  chatReciever: UsersEntity;

  @ManyToOne(() => ChatRoomsEntity, (chatRooms) => chatRooms.chatsEntity)
  chatRoomsEntity: ChatRoomsEntity;
}
