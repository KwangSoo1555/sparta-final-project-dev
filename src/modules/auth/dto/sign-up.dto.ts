import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEmail,
  MinLength,
  IsNumber,
  IsEnum,
  IsOptional,
} from "class-validator";
import { Exclude } from "class-transformer";
import { passwordMatch } from "src/common/customs/pipes/auth-validator";
import { SocialProviders } from "src/common/customs/enums/enum-social-providers";

export class UserSignUpDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  email: string;

  @Exclude({ toPlainOnly: true })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password?: string;

  @IsNotEmpty()
  @IsOptional()
  @passwordMatch("password")
  passwordCheck?: string;

  @IsOptional()
  @IsEnum(SocialProviders)
  @IsString()
  provider?: SocialProviders;

  @IsOptional()
  @IsString()
  socialId?: string;

  @IsOptional()
  @IsNumber()
  verificationCode?: number;
}
