import { IsNotEmpty, IsEmail, MaxLength, IsString, MinLength } from "class-validator";
import { PickType } from "@nestjs/mapped-types";
import { UserSignUpDto } from "./sign-up.dto";
import { SocialProviders } from "src/common/customs/enums/enum-social-providers";

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

export class GoogleSignInDto extends PickType(UserSignUpDto, [
  "email",
  "name",
  "socialId",
  "provider",
] as const) {
  provider: SocialProviders;
}

export class NaverSignInDto extends PickType(UserSignUpDto, [
  "email",
  "name",
  "socialId",
  "provider",
] as const) {
  provider: SocialProviders;
}

export class KakaoSignInDto extends PickType(UserSignUpDto, [
  "email",
  "name",
  "socialId",
  "provider",
] as const) {
  provider: SocialProviders;
}
