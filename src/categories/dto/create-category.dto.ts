import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Marketing' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  name: string;
}
