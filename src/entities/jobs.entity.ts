<<<<<<< HEAD
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

  @Column({ type: "bigint" })
  address: number;

  @Column()
  category: string;

  @Column({ type: "boolean", name: "expired_yn" })
  expiredYn: boolean;

  @Column({ type: "boolean", name: "matched_yn" })
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
=======
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

  @Column({ type: "bigint" })
  address: number;

  @Column()
  category: string;

  @Column({ type: "boolean", name: "expired_yn" })
  expiredYn: boolean;

  @Column({ type: "boolean", name: "matched_yn" })
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
>>>>>>> a79eb53a78d8df92a45067b66b6d3f4ae2ab1a5d
