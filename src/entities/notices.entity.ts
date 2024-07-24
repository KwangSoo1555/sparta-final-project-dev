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
import { IsNotEmpty, IsString } from "class-validator";

@Entity("notices")
export class NoticesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  /**
   * 제목
   * @example "2024년 여름 휴가 안내"
   */
  @IsString()
  @IsNotEmpty({ message: "제목을 작성해 주세요" })
  @Column()
  title: string;

  /**
   * 본문
   * @example "안녕하세요. 2024년 여름 휴가 기간을 안내해 드립니다. 올해 여름 휴가는 7월 29일부터 8월 2일까지입니다."
   */
  @IsString()
  @IsNotEmpty({ message: "본문 내용을 작성해 주세요." })
  @Column()
  description: string;

  /**
   * 이미지
   * @example "https://example.com/images/summer_vacation_2024.jpg"
   */
  @IsString()
  @IsNotEmpty({ message: "이미지를 입력해 주세요." })
  @Column({ name: "image_url" })
  imageUrl: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => UsersEntity, (user) => user.notices)
  @JoinColumn({ name: "user_id" })
  user: UsersEntity;
}
