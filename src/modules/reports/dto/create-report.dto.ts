import { PickType, IntersectionType } from "@nestjs/swagger";
import { UsersEntity } from "src/entities/users.entity";
import { ReportsEntity } from "src/entities/reports.entity";

export class CreateReportDto extends IntersectionType(
  PickType(UsersEntity, ['email']),
  PickType(ReportsEntity, ['reason', 'description'])
) {}
