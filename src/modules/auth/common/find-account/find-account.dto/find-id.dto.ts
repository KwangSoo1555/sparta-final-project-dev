import { IsNotEmpty, IsEmail, MaxLength, IsString, IsNumber } from "class-validator";

export class FindIdDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsNumber()
  verificationCode: number;
}
