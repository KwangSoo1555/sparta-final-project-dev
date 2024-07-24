import { IsNotEmpty, IsEmail, MaxLength, IsNumber } from "class-validator";

export class FindPwDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;
}
