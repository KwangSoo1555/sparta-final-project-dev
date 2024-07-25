import {
  IsNotEmpty,
  IsEmail,
  MaxLength,
  IsString,
  MinLength,
} from "class-validator";

export class UserLocalSignInDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}
