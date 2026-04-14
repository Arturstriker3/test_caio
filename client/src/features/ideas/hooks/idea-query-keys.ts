export const ideaQueryKeys = {
  all: ['ideas'] as const,
  list: (page: number, pageSize: number) => ['ideas', page, pageSize] as const,
};
