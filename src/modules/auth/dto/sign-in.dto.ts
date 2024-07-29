import { IsNotEmpty, IsEmail, MaxLength, IsString, MinLength } from "class-validator";

export class LocalSignInDto {
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

export class GoogleSignInDto {
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
  socialId: string;

  @IsNotEmpty()
  @IsString()
  provider: string;
}

export class NaverSignInDto {}

export class KakaoSignInDto {}
