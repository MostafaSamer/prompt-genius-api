import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePromptDto } from './dto/create-prompt.dto.js';
import { UpdatePromptDto } from './dto/update-prompt.dto.js';
import { RunPromptDto } from './dto/run-prompt.dto.js';
import OpenAI from 'openai';

@Injectable()
export class PromptsService {
  private openai: OpenAI;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  /**
   * Extract placeholders from prompt content
   * Finds all {placeholder} patterns
   */
  private extractPlaceholders(content: string): string[] {
    const regex = /\{(\w+)\}/g;
    const matches = content.matchAll(regex);
    const placeholders = Array.from(matches, (match) => match[1]);
    return [...new Set(placeholders)]; // Remove duplicates
  }

  /**
   * Replace placeholders in content with actual values
   */
  private replacePlaceholders(content: string, placeholders: Record<string, string>): string {
    let result = content;
    for (const [key, value] of Object.entries(placeholders)) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    return result;
  }

  async create(userId: string, createPromptDto: CreatePromptDto) {
    const placeholders = this.extractPlaceholders(createPromptDto.content);

    // Validate category belongs to user if provided
    if (createPromptDto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: createPromptDto.categoryId, userId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    return this.prisma.prompt.create({
      data: {
        ...createPromptDto,
        userId,
        placeholders,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(userId: string, categoryId?: string) {
    const where: any = { userId };
    if (categoryId) {
      where.categoryId = categoryId;
    }

    return this.prisma.prompt.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const prompt = await this.prisma.prompt.findFirst({
      where: { id, userId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!prompt) {
      throw new NotFoundException('Prompt not found');
    }

    return prompt;
  }

  async update(id: string, userId: string, updatePromptDto: UpdatePromptDto) {
    const prompt = await this.prisma.prompt.findFirst({
      where: { id, userId },
    });

    if (!prompt) {
      throw new NotFoundException('Prompt not found');
    }

    // If content is being updated, extract new placeholders
    let placeholders = prompt.placeholders;
    if (updatePromptDto.content) {
      placeholders = this.extractPlaceholders(updatePromptDto.content);
    }

    // Validate category belongs to user if provided
    if (updatePromptDto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: updatePromptDto.categoryId, userId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    return this.prisma.prompt.update({
      where: { id },
      data: {
        ...updatePromptDto,
        placeholders,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async remove(id: string, userId: string) {
    const prompt = await this.prisma.prompt.findFirst({
      where: { id, userId },
    });

    if (!prompt) {
      throw new NotFoundException('Prompt not found');
    }

    return this.prisma.prompt.delete({
      where: { id },
    });
  }

  async runPrompt(id: string, userId: string, runPromptDto: RunPromptDto) {
    if (!this.openai) {
      throw new BadRequestException('OpenAI API key is not configured');
    }

    const prompt = await this.prisma.prompt.findFirst({
      where: { id, userId },
    });

    if (!prompt) {
      throw new NotFoundException('Prompt not found');
    }

    // Validate all required placeholders are provided
    const requiredPlaceholders = prompt.placeholders;
    const providedPlaceholders = Object.keys(runPromptDto.placeholders);
    
    const missingPlaceholders = requiredPlaceholders.filter(
      (placeholder) => !providedPlaceholders.includes(placeholder),
    );

    if (missingPlaceholders.length > 0) {
      throw new BadRequestException(
        `Missing required placeholders: ${missingPlaceholders.join(', ')}`,
      );
    }

    // Replace placeholders in prompt content
    const filledPrompt = this.replacePlaceholders(
      prompt.content,
      runPromptDto.placeholders,
    );

    // Call OpenAI API
    try {
      const completion = await this.openai.chat.completions.create({
        model: runPromptDto.model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: filledPrompt,
          },
        ],
        temperature: runPromptDto.temperature ?? 0.7,
      });

      return {
        prompt: filledPrompt,
        result: completion.choices[0]?.message?.content || '',
        model: completion.model,
        usage: completion.usage,
      };
    } catch (error) {
      throw new BadRequestException(`OpenAI API error: ${error.message}`);
    }
  }
}
