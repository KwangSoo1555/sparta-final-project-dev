import { IsNotEmpty, IsEmail, MaxLength, IsString } from "class-validator";

export class FindPwDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  tempPassword: string;
}
