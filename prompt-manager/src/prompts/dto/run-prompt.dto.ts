import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';

export class RunPromptDto {
  @ApiProperty({ 
    example: { productName: 'iPhone 15', features: 'A17 chip, 48MP camera', targetAudience: 'tech enthusiasts' },
    description: 'Object containing values for placeholders in the prompt'
  })
  @IsObject()
  @IsNotEmpty()
  placeholders: Record<string, string>;

  @ApiProperty({ 
    example: 'gpt-4',
    description: 'OpenAI model to use',
    required: false,
    default: 'gpt-3.5-turbo'
  })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ 
    example: 0.7,
    description: 'Temperature for the OpenAI API',
    required: false,
    default: 0.7
  })
  @IsOptional()
  temperature?: number;
}
