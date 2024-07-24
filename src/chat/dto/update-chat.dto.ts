import { IsNotEmpty, IsString } from "class-validator";
import { CreateChatDto } from "./create-chat.dto";
import { OmitType } from "@nestjs/mapped-types";

export class UpdateChatDto extends OmitType(CreateChatDto, ["recieverId"]) {
  @IsNotEmpty()
  @IsString()
  content: string;
}
