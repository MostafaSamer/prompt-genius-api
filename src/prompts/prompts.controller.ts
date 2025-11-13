import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PromptsService } from './prompts.service.js';
import { CreatePromptDto } from './dto/create-prompt.dto.js';
import { UpdatePromptDto } from './dto/update-prompt.dto.js';
import { RunPromptDto } from './dto/run-prompt.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@ApiTags('Prompts')
@Controller('prompts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new prompt' })
  @ApiResponse({ status: 201, description: 'Prompt created successfully' })
  create(@CurrentUser() user: any, @Body() createPromptDto: CreatePromptDto) {
    return this.promptsService.create(user.id, createPromptDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all prompts for current user' })
  @ApiQuery({ name: 'categoryId', required: false, description: 'Filter by category ID' })
  @ApiResponse({ status: 200, description: 'Prompts retrieved successfully' })
  findAll(@CurrentUser() user: any, @Query('categoryId') categoryId?: string) {
    return this.promptsService.findAll(user.id, categoryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a prompt by ID' })
  @ApiParam({ name: 'id', description: 'Prompt ID' })
  @ApiResponse({ status: 200, description: 'Prompt retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Prompt not found' })
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.promptsService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a prompt' })
  @ApiParam({ name: 'id', description: 'Prompt ID' })
  @ApiResponse({ status: 200, description: 'Prompt updated successfully' })
  @ApiResponse({ status: 404, description: 'Prompt not found' })
  update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updatePromptDto: UpdatePromptDto,
  ) {
    return this.promptsService.update(id, user.id, updatePromptDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a prompt' })
  @ApiParam({ name: 'id', description: 'Prompt ID' })
  @ApiResponse({ status: 200, description: 'Prompt deleted successfully' })
  @ApiResponse({ status: 404, description: 'Prompt not found' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.promptsService.remove(id, user.id);
  }

  @Post(':id/run')
  @ApiOperation({ summary: 'Run a prompt with OpenAI API' })
  @ApiParam({ name: 'id', description: 'Prompt ID' })
  @ApiResponse({ status: 200, description: 'Prompt executed successfully' })
  @ApiResponse({ status: 400, description: 'Bad request or missing placeholders' })
  @ApiResponse({ status: 404, description: 'Prompt not found' })
  runPrompt(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() runPromptDto: RunPromptDto,
  ) {
    return this.promptsService.runPrompt(id, user.id, runPromptDto);
  }
}
