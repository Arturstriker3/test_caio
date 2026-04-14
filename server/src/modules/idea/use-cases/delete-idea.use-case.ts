import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IDEA_REPOSITORY, type IdeaRepository } from '../repository/idea.repository.interface';

@Injectable()
export class DeleteIdeaUseCase {
  constructor(@Inject(IDEA_REPOSITORY) private readonly ideaRepository: IdeaRepository) {}

  async execute(id: string): Promise<void> {
    const wasDeleted = await this.ideaRepository.delete(id);

    if (!wasDeleted) {
      throw new NotFoundException('Idea not found.');
    }
  }
}
