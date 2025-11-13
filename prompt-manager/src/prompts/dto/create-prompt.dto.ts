import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsUUID } from 'class-validator';

export class CreatePromptDto {
  @ApiProperty({ example: 'Product Description Generator' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ 
    example: 'Write a compelling product description for {productName} that highlights its {features} and appeals to {targetAudience}.' 
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ 
    example: 'Generates product descriptions with customizable placeholders',
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
