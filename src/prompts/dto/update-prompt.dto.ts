import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdatePromptDto {
  @ApiProperty({ example: 'Product Description Generator', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ 
    example: 'Write a compelling product description for {productName}...',
    required: false 
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ 
    example: 'Generates product descriptions',
    required: false 
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ 
    example: 'category-uuid-here',
    required: false 
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
