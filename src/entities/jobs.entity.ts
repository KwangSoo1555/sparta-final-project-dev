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
  title: String;

  @Column()
  content: String;

  @Column({ name: "photo_url" })
  photoUrl: String;

  @Column()
  price: number;

  @Column()
  address: String;

  @Column()
  category: String;

  @Column({ type: 'boolean' })
  expiredYn: boolean;
  
  @Column({ type: 'boolean' })
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
