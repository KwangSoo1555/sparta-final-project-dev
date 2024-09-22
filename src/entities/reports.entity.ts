import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ObjectType, Field, ID } from "@nestjs/graphql";

import { UsersEntity } from "./users.entity";
import { ReportReason } from "../common/customs/types/enum-report-reason";

@Entity("reports")
@ObjectType()
export class ReportsEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID, { description: "신고 아이디" })
  id: number;

  @Column({ name: "reporter_id" })
  @Field(() => ID, { description: "신고자 아이디" })
  reporterId: number;

  @Column({ name: "reported_id" })
  @Field(() => ID, { description: "신고 당한 사람 아이디" })
  reportedId: number;

  @Column({ type: "enum", enum: ReportReason, default: ReportReason.OTHER })
  @Field(() => ReportReason, { description: "신고 사유" })
  reason: ReportReason;

  @Column({ type: "text" })
  @Field(() => String, { description: "신고 상세 설명" })
  description: string;

  @CreateDateColumn({ type: "timestamp" })
  @Field(() => Date, { description: "생성일" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  @Field(() => Date, { description: "갱신일" })
  updatedAt: Date;

  @ManyToOne(() => UsersEntity, (user) => user.reporter)
  @JoinColumn({ name: "reporter_id" })
  reporter: UsersEntity;

  @ManyToOne(() => UsersEntity, (user) => user.reported)
  @JoinColumn({ name: "reported_id" })
  reported: UsersEntity;
}
