import { PickType } from "@nestjs/swagger";
import { NoticesEntity } from "src/entities/notices.entity";

export class CreateNoticeDto extends PickType(NoticesEntity, [
  "title",
  "description",
  "imageUrl",
]) {}
