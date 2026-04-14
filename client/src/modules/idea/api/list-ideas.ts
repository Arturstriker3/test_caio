import type { Idea, PaginatedResponse } from '../types/idea.types';

const DEFAULT_API_URL = 'http://127.0.0.1:3000';

interface ListIdeasParams {
  page: number;
  pageSize: number;
}

export async function listIdeas(params: ListIdeasParams): Promise<PaginatedResponse<Idea>> {
  const baseUrl = import.meta.env.VITE_API_URL ?? DEFAULT_API_URL;
  const search = new URLSearchParams({
    page: String(params.page),
    pageSize: String(params.pageSize),
  });

  const response = await fetch(`${baseUrl}/ideas?${search.toString()}`);

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar ideias.');
  }

  return (await response.json()) as PaginatedResponse<Idea>;
}
