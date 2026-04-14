import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ideaRepository } from '../repository/idea.repository';
import type { UpdateIdeaInput } from '../types/idea.types';
import { ideaQueryKeys } from './idea-query-keys';

export function useUpdateIdeaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateIdeaInput) => ideaRepository.update(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ideaQueryKeys.all });
    },
  });
}
