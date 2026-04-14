import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ideaRepository } from '../repository/idea.repository';
import type { CreateIdeaInput } from '../types/idea.types';
import { ideaQueryKeys } from './idea-query-keys';

export function useCreateIdeaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateIdeaInput) => ideaRepository.create(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ideaQueryKeys.all });
    },
  });
}
