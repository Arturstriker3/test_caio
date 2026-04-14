import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { UpdateIdeaRequestData } from '../dto/update-idea-request.dto';
import { IdeaEntity } from '../idea.entity';
import { IDEA_REPOSITORY, type IdeaRepository } from '../repository/idea.repository.interface';

@Injectable()
export class UpdateIdeaUseCase {
  constructor(@Inject(IDEA_REPOSITORY) private readonly ideaRepository: IdeaRepository) {}

  async execute(id: string, input: UpdateIdeaRequestData): Promise<IdeaEntity> {
    const updatedIdea = await this.ideaRepository.update(id, input);

    if (!updatedIdea) {
      throw new NotFoundException('Idea not found.');
    }

    return updatedIdea;
  }
}
