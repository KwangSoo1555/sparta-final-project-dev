import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateJobDto {

  @IsNotEmpty({ message: '제목을 입력해주세요.' })
  @IsString()
  title: String;

  @IsNotEmpty({ message: '내용을 입력해주세요.' })
  @IsString()
  content: String;

  @IsOptional()
  @IsString()
  photoUrl: String;

  @IsNotEmpty({ message: '가격을 입력해주세요.' })
  @IsNumber()
  price: number;

  @IsNotEmpty({ message: '주소를 입력해주세요.' })
  @IsString()
  address: String;

  @IsNotEmpty({ message: '카테고리를 입력해주세요.' })
  @IsString()
  category: String;
}
