import type { PaginationQueryData } from './dto/pagination-query.dto';

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

/**
 * Builds a paginated response using the current query and total items count.
 * @param items - Current page items.
 * @param totalItems - Total records available.
 * @param query - Pagination query input.
 * @returns Paginated result with items and metadata.
 */
export function buildPaginatedResult<T>(
  items: T[],
  totalItems: number,
  query: PaginationQueryData,
): PaginatedResult<T> {
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / query.pageSize);

  return {
    items,
    meta: {
      page: query.page,
      pageSize: query.pageSize,
      totalItems,
      totalPages,
      hasNextPage: totalPages > 0 && query.page < totalPages,
      hasPreviousPage: query.page > 1,
    },
  };
}
