import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { LocalCodesEntity } from "./local-codes.entity";
import { UsersEntity } from "./users.entity";

@Entity("users_localcodes")
export class UsersLocalCodesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "user_id" })
  userId: number;

  @Column({ name: "localcodes_id" })
  localcodesId: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "delete_at", default: null })
  deletedAt: Date;

  @OneToMany(() => LocalCodesEntity, (localCodes) => localCodes.usersLocalCodesEntity)
  localCodesEntity: LocalCodesEntity[];

  @OneToMany(() => UsersEntity, (users) => users.usersLocalCodes)
  usersEntity: UsersEntity[];
}
