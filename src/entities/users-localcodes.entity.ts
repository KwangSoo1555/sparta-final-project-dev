import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { LocalCodesEntity } from "./local-codes.entity";
import { UsersEntity } from "./users.entity";

@Entity("users_localcodes")
export class UsersLocalCodesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntity, (user) => user.usersLocalCodes, { onDelete: "CASCADE" })
  user: UsersEntity;

  @ManyToOne(() => LocalCodesEntity, (localCode) => localCode.usersLocalCodes, {
    onDelete: "CASCADE",
  })
  localCode: LocalCodesEntity;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @DeleteDateColumn({ name: "delete_at", default: null })
  deletedAt: Date;
}
