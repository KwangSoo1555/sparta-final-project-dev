import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { UsersEntity } from "./users.entity";
import { JobsEntity } from "./jobs.entity";

@Entity("job_matching")
export class JobsMatchingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "customer_id" })
  customerId: number;

  @Column({ name: "job_id" })
  jobId: number;

  @Column({ type: 'boolean' , name: "matched_yn" })
  matchedYn: boolean;
  
  @Column({ type: 'boolean' , name: "rejected_yn" })
  rejectedYn: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @DeleteDateColumn({ name: "delete_at", default: null })
  deletedAt: Date;

  @ManyToOne(() => UsersEntity, (users) => users.jobsMatching, { onDelete: "CASCADE" })
  @JoinColumn({ name: "customer_id" })
  users: UsersEntity;

  @ManyToOne(() => JobsEntity, (job) => job.jobsMatching, { onDelete: "CASCADE" })
  @JoinColumn({ name: "job_id" })
  job: JobsEntity;
}
