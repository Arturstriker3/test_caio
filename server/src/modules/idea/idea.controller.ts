import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/pagination/dto/pagination-query.dto';
import { CreateIdeaRequestDto } from './dto/create-idea-request.dto';
import { IdeaIdParamDto } from './dto/idea-id-param.dto';
import { ListIdeasResponseDto } from './dto/list-ideas-response.dto';
import { IdeaResponseDto } from './dto/idea-response.dto';
import { UpdateIdeaRequestDto } from './dto/update-idea-request.dto';
import { CreateIdeaUseCase } from './use-cases/create-idea.use-case';
import { DeleteIdeaUseCase } from './use-cases/delete-idea.use-case';
import { GetIdeaDetailsUseCase } from './use-cases/get-idea-details.use-case';
import { ListIdeasUseCase } from './use-cases/list-ideas.use-case';
import { UpdateIdeaUseCase } from './use-cases/update-idea.use-case';

@ApiTags('ideas')
@Controller('ideas')
export class IdeaController {
  constructor(
    private readonly listIdeasUseCase: ListIdeasUseCase,
    private readonly getIdeaDetailsUseCase: GetIdeaDetailsUseCase,
    private readonly createIdeaUseCase: CreateIdeaUseCase,
    private readonly updateIdeaUseCase: UpdateIdeaUseCase,
    private readonly deleteIdeaUseCase: DeleteIdeaUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List ideas' })
  @ApiOkResponse({ type: ListIdeasResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid request data.' })
  async listIdeas(@Query() query: PaginationQueryDto): Promise<ListIdeasResponseDto> {
    const result = await this.listIdeasUseCase.execute(query);
    return ListIdeasResponseDto.fromPaginatedEntities(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get idea by id' })
  @ApiParam({ name: 'id', type: String, description: 'Idea UUID v7 identifier.' })
  @ApiOkResponse({ type: IdeaResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid request data.' })
  @ApiNotFoundResponse({ description: 'Idea not found.' })
  async getIdeaById(@Param() params: IdeaIdParamDto): Promise<IdeaResponseDto> {
    const idea = await this.getIdeaDetailsUseCase.execute(params.id);
    return IdeaResponseDto.fromEntity(idea);
  }

  @Post()
  @ApiOperation({ summary: 'Create idea' })
  @ApiCreatedResponse({ type: IdeaResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid request data.' })
  async createIdea(@Body() body: CreateIdeaRequestDto): Promise<IdeaResponseDto> {
    const idea = await this.createIdeaUseCase.execute(body);
    return IdeaResponseDto.fromEntity(idea);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update idea' })
  @ApiParam({ name: 'id', type: String, description: 'Idea UUID v7 identifier.' })
  @ApiOkResponse({ type: IdeaResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid request data.' })
  @ApiNotFoundResponse({ description: 'Idea not found.' })
  async updateIdea(@Param() params: IdeaIdParamDto, @Body() body: UpdateIdeaRequestDto): Promise<IdeaResponseDto> {
    const idea = await this.updateIdeaUseCase.execute(params.id, body);
    return IdeaResponseDto.fromEntity(idea);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete idea' })
  @ApiParam({ name: 'id', type: String, description: 'Idea UUID v7 identifier.' })
  @ApiNoContentResponse({ description: 'Idea deleted successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid request data.' })
  @ApiNotFoundResponse({ description: 'Idea not found.' })
  async deleteIdea(@Param() params: IdeaIdParamDto): Promise<void> {
    await this.deleteIdeaUseCase.execute(params.id);
  }
}
