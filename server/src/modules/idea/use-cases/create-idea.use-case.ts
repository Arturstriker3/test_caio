import { Inject, Injectable } from '@nestjs/common';
import type { CreateIdeaDto } from '../dto/create-idea.dto';
import { IdeaEntity } from '../idea.entity';
import { IDEA_REPOSITORY, type IdeaRepository } from '../repository/idea.repository.interface';

@Injectable()
export class CreateIdeaUseCase {
  constructor(@Inject(IDEA_REPOSITORY) private readonly ideaRepository: IdeaRepository) {}

  async execute(input: CreateIdeaDto): Promise<IdeaEntity> {
    return this.ideaRepository.create(input);
  }
}
