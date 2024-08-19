import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UsersLocalCodesEntity } from "./users-localcodes.entity";

@Entity("localcodes")
export class LocalCodesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "local_code" })
  localCode: number;

  @Column({ name: "City" })
  city: string;

  @Column({ name: "District", default: null })
  district: string;

  @Column({ name: "Dong", default: null })
  dong: string;

  @ManyToOne(() => UsersLocalCodesEntity, (usersLocalCodes) => usersLocalCodes.localCodesEntity)
  @JoinColumn({ name: "localcodes_id" })
  usersLocalCodesEntity: UsersLocalCodesEntity;
}
