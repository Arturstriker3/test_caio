import { ApiProperty } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../../common/pagination/dto/pagination-meta.dto';
import type { PaginatedResult } from '../../../common/pagination/paginated-result';
import { IdeaEntity } from '../idea.entity';
import { IdeaResponseDto } from './idea-response.dto';

export class ListIdeasResponseDto {
  @ApiProperty({ type: IdeaResponseDto, isArray: true })
  items!: IdeaResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;

  static fromPaginatedEntities(result: PaginatedResult<IdeaEntity>): ListIdeasResponseDto {
    return {
      items: IdeaResponseDto.fromEntities(result.items),
      meta: result.meta,
    };
  }
}
