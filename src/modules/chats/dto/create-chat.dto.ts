import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateChatDto {
  @IsNotEmpty()
  @IsNumber()
  receiverId: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
