import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ideaRepository } from '../repository/idea.repository';
import type { DeleteIdeaInput } from '../types/idea.types';
import { ideaQueryKeys } from './idea-query-keys';

export function useDeleteIdeaMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteIdeaInput) => ideaRepository.remove(input),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ideaQueryKeys.all });
    },
  });
}
