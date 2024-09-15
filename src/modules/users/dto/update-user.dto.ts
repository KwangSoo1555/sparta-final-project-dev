import { IsString, IsEmail, MinLength, MaxLength, IsOptional } from "class-validator";
import { Exclude } from "class-transformer";

export class UsersUpdateDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @MinLength(8)
  @MaxLength(20)
  currentPasswordCheck?: string;

  @IsOptional()
  @Exclude({ toPlainOnly: true })
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  newPassword?: string;
}