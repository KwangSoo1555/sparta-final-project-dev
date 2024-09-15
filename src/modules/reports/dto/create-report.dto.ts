import {PickType} from "@nestjs/graphql"
import { ApiProperty } from "@nestjs/swagger";

import { ReportsEntity } from "src/entities/reports.entity";
import { IsNumber } from "class-validator";

export class CreateReportDto extends PickType(ReportsEntity, ["reason", "description"]) {
  @ApiProperty({ description: "신고자 ID" })
  @IsNumber()
  ownerId: number;
}
