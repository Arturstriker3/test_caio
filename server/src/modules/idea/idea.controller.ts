import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { parseCreateIdeaDto } from './dto/create-idea.dto';
import { parseIdeaIdDto } from './dto/idea-id.dto';
import { parseUpdateIdeaDto } from './dto/update-idea.dto';
import { IdeaEntity } from './idea.entity';
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
  async listIdeas(): Promise<IdeaEntity[]> {
    return this.listIdeasUseCase.execute();
  }

  @Get(':id')
  async getIdeaById(@Param('id') idParam: string): Promise<IdeaEntity> {
    const id = parseIdeaIdDto(idParam);
    return this.getIdeaDetailsUseCase.execute(id);
  }

  @Post()
  async createIdea(@Body() body: unknown): Promise<IdeaEntity> {
    const input = parseCreateIdeaDto(body);
    return this.createIdeaUseCase.execute(input);
  }

  @Patch(':id')
  async updateIdea(@Param('id') idParam: string, @Body() body: unknown): Promise<IdeaEntity> {
    const id = parseIdeaIdDto(idParam);
    const input = parseUpdateIdeaDto(body);
    return this.updateIdeaUseCase.execute(id, input);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteIdea(@Param('id') idParam: string): Promise<void> {
    const id = parseIdeaIdDto(idParam);
    await this.deleteIdeaUseCase.execute(id);
  }
}
