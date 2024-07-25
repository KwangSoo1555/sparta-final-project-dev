import { PickType } from "@nestjs/swagger";
import { ReportsEntity } from "src/entities/reports.entity";

export class UpdateReportDto extends PickType(ReportsEntity, ["reason", "description"]) {}
