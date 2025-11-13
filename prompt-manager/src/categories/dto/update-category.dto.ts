import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateCategoryDto {
  @ApiProperty({ example: 'Marketing', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
}
