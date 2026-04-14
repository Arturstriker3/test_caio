import { Inject, Injectable } from '@nestjs/common';
import { IdeaEntity } from '../idea.entity';
import { IDEA_REPOSITORY, type IdeaRepository } from '../repository/idea.repository.interface';

@Injectable()
export class ListIdeasUseCase {
  constructor(@Inject(IDEA_REPOSITORY) private readonly ideaRepository: IdeaRepository) {}

  async execute(): Promise<IdeaEntity[]> {
    return this.ideaRepository.findAll();
  }
}
