import { Inject, Injectable } from '@nestjs/common';
import type { PaginationQueryData } from '../../../common/pagination/dto/pagination-query.dto';
import type { PaginatedResult } from '../../../common/pagination/paginated-result';
import { IdeaEntity } from '../idea.entity';
import { IDEA_REPOSITORY, type IdeaRepository } from '../repository/idea.repository.interface';

@Injectable()
export class ListIdeasUseCase {
  constructor(@Inject(IDEA_REPOSITORY) private readonly ideaRepository: IdeaRepository) {}

  async execute(query: PaginationQueryData): Promise<PaginatedResult<IdeaEntity>> {
    return this.ideaRepository.findAllPaginated(query);
  }
}
