import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { UsersEntity } from "./users.entity";

@Entity("blacklists")
export class BlacklistsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ name: "blacked_id" })
  blackedId: number;

  @ManyToOne(() => UsersEntity, (user) => user.blacklists, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: UsersEntity;

  @ManyToOne(() => UsersEntity, (user) => user.blackedUser, { onDelete: "CASCADE" })
  @JoinColumn({ name: "blacked_id" })
  blackedUser: UsersEntity;
}
