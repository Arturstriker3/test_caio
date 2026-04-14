import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { CreateIdeaRequestDto } from './dto/create-idea-request.dto';
import { IdeaIdParamDto } from './dto/idea-id-param.dto';
import { IdeaResponseDto } from './dto/idea-response.dto';
import { UpdateIdeaRequestDto } from './dto/update-idea-request.dto';
import { CreateIdeaUseCase } from './use-cases/create-idea.use-case';
import { DeleteIdeaUseCase } from './use-cases/delete-idea.use-case';
import { GetIdeaDetailsUseCase } from './use-cases/get-idea-details.use-case';
import { ListIdeasUseCase } from './use-cases/list-ideas.use-case';
import { UpdateIdeaUseCase } from './use-cases/update-idea.use-case';

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
  async listIdeas(): Promise<IdeaResponseDto[]> {
    const ideas = await this.listIdeasUseCase.execute();
    return IdeaResponseDto.fromEntities(ideas);
  }

  @Get(':id')
  async getIdeaById(@Param() params: IdeaIdParamDto): Promise<IdeaResponseDto> {
    const idea = await this.getIdeaDetailsUseCase.execute(params.id);
    return IdeaResponseDto.fromEntity(idea);
  }

  @Post()
  async createIdea(@Body() body: CreateIdeaRequestDto): Promise<IdeaResponseDto> {
    const idea = await this.createIdeaUseCase.execute(body);
    return IdeaResponseDto.fromEntity(idea);
  }

  @Patch(':id')
  async updateIdea(@Param() params: IdeaIdParamDto, @Body() body: UpdateIdeaRequestDto): Promise<IdeaResponseDto> {
    const idea = await this.updateIdeaUseCase.execute(params.id, body);
    return IdeaResponseDto.fromEntity(idea);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteIdea(@Param() params: IdeaIdParamDto): Promise<void> {
    await this.deleteIdeaUseCase.execute(params.id);
  }
}
