import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UsersEntity } from "./users.entity";

@Entity("reports")
export class ReportsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "reporter_id" })
  reporterId: number;

  @Column({ name: "reported_id" })
  reportedId: number;

  @Column()
  reason: string;

  @Column({ type: "text" })
  description: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => UsersEntity, (user) => user.reporter)
  @JoinColumn({ name: "reporter_id" })
  reporter: UsersEntity;

  @ManyToOne(() => UsersEntity, (user) => user.reported)
  @JoinColumn({ name: "reported_id" })
  reported: UsersEntity;
}
