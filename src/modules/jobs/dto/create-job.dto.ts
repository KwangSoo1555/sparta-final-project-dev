import { IsNotEmpty, IsString, IsOptional, IsNumber } from "class-validator";

export class CreateJobDto {
  @IsNotEmpty({ message: "제목을 입력해주세요." })
  @IsString()
  title: string;

  @IsNotEmpty({ message: "내용을 입력해주세요." })
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  photoUrl: string;

  @IsNotEmpty({ message: "가격을 입력해주세요." })
  @IsNumber()
  price: number;

  @IsNotEmpty({ message: "주소를 입력해주세요." })
  @IsString()
  city: string;

  @IsNotEmpty({ message: "주소를 입력해주세요." })
  @IsString()
  district: string;

  @IsNotEmpty({ message: "주소를 입력해주세요." })
  @IsString()
  dong: string;

  @IsNotEmpty({ message: "카테고리를 입력해주세요." })
  @IsString()
  category: string;
}
