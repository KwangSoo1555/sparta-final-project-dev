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
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ReportReason } from "../common/customs/types/enum-report-reason";

@Entity("reports")
export class ReportsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "reporter_id" })
  reporterId: number;

  @Column({ name: "reported_id" })
  reportedId: number;

  /**
   * @example '불쾌감을 주는 행위'
   */
  @IsString()
  @IsNotEmpty({ message: "신고 사유를 작성 해주세요." })
  @IsEnum(ReportReason, {message: '올바른 신고 사유를 선택해주세요.'})
  @Column({type: 'enum', enum: ReportReason, default: ReportReason.OTHER})
  reason: string;

  /**
   * @example "해당 사용자가 커뮤니티 게시판에 지속적으로 타인을 비하하는 댓글을 작성하고 있습니다. 특히 20xx년 7월 24일 오후 2시경에 작성된 '일반 게시판'의 '여름 휴가 계획' 게시물에서 다른 사용자들의 의견을 모욕적인 언어로 비난하였습니다. 이는 커뮤니티 가이드라인을 위반하는 행위로 판단됩니다."
   */
  @IsString()
  @IsNotEmpty({ message: "신고 상세 설명을 작성 해주세요." })
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
