import { useQuery } from '@tanstack/react-query';
import { ideaRepository } from '../repository/idea.repository';
import { ideaQueryKeys } from './idea-query-keys';

interface UseListIdeasQueryParams {
  page: number;
  pageSize: number;
}

export function useListIdeasQuery(params: UseListIdeasQueryParams) {
  return useQuery({
    queryKey: ideaQueryKeys.list(params.page, params.pageSize),
    queryFn: () => ideaRepository.list(params),
  });
}
