import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IdeaEntity } from '../idea.entity';
import { IDEA_REPOSITORY, type IdeaRepository } from '../repository/idea.repository.interface';

@Injectable()
export class GetIdeaDetailsUseCase {
  constructor(@Inject(IDEA_REPOSITORY) private readonly ideaRepository: IdeaRepository) {}

  async execute(id: string): Promise<IdeaEntity> {
    const idea = await this.ideaRepository.findById(id);

    if (!idea) {
      throw new NotFoundException('Idea not found.');
    }

    return idea;
  }
}
