<<<<<<< HEAD
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { UsersEntity } from "./users.entity";

@Entity("refresh_tokens")
export class RefreshTokensEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ name: "refresh_token", nullable: true })
  refreshToken: string;

  @Column()
  ip: string;

  @Column({ name: "user_agent" })
  userAgent: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @UpdateDateColumn({ name: "expires_at" })
  expiresAt: Date;

  @OneToOne(() => UsersEntity, (user) => user.refreshToken)
  @JoinColumn({ name: "user_id" })
  user: UsersEntity;
}
=======
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import { UsersEntity } from "./users.entity";

@Entity("refresh_tokens")
export class RefreshTokensEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ name: "refresh_token", nullable: true })
  refreshToken: string;

  @Column()
  ip: string;

  @Column({ name: "user_agent" })
  userAgent: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @UpdateDateColumn({ name: "expires_at" })
  expiresAt: Date;

  @OneToOne(() => UsersEntity, (user) => user.refreshToken)
  @JoinColumn({ name: "user_id" })
  user: UsersEntity;
}
>>>>>>> a79eb53a78d8df92a45067b66b6d3f4ae2ab1a5d
