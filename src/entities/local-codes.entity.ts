import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UsersLocalCodesEntity } from "./users-localcodes.entity";

@Entity("localcodes")
export class LocalCodesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "local_code", type: "bigint" })
  localCode: number;

  @Column({ name: "City" })
  city: string;

  @Column({ name: "District", default: null })
  district: string;

  @Column({ name: "Dong", default: null })
  dong: string;

  @OneToMany(() => UsersLocalCodesEntity, (usersLocalCodes) => usersLocalCodes.localCode)
  usersLocalCodes: UsersLocalCodesEntity[];
}
