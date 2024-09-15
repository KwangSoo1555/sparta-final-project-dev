import { IsNotEmpty, IsString } from "class-validator";
import { CreateChatDto } from "./create-chat.dto";
import { OmitType } from "@nestjs/graphql";

export class UpdateChatDto extends OmitType(CreateChatDto, ["receiverId"]) {
  @IsNotEmpty()
  @IsString()
  content: string;
}
