import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";

import { UsersEntity } from "./users.entity";
import { JobsMatchingEntity } from "./jobs-matching.entity";

@Entity("jobs")
export class JobsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "owner_id" })
  ownerId: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ name: "photo_url" })
  photoUrl: string;

  @Column()
  price: number;

  @Column()
  address: string;

  @Column()
  category: string;

  @Column({ type: 'boolean' , name: "expired_yn" })
  expiredYn: boolean;
  
  @Column({ type: 'boolean' , name: "matched_yn" })
  matchedYn: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "delete_at", default: null })
  deletedAt: Date;

  @OneToMany(() => JobsMatchingEntity, (jobsMatching) => jobsMatching.job, { cascade: true })
  jobsMatching: JobsMatchingEntity[];

  @ManyToOne(() => UsersEntity, (usersEntity) => usersEntity.jobs, { onDelete: "CASCADE" })
  @JoinColumn({ name: "owner_id" })
  usersEntity: UsersEntity;
}
