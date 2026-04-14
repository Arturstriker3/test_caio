import { ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';

export const paginationQueryDtoSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
});

export type PaginationQueryData = z.infer<typeof paginationQueryDtoSchema>;

export class PaginationQueryDto {
  static readonly schema = paginationQueryDtoSchema;

  @ApiPropertyOptional({ example: 1, minimum: 1, default: 1, description: 'Current page number.' })
  page!: number;

  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 100, default: 10, description: 'Items per page.' })
  pageSize!: number;
}
