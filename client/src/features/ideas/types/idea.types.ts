import type { PaginatedResponse } from '../../../shared/types/pagination.types';

export interface Idea {
  id: string;
  whatCanBeImproved: string;
  currentProcess: string;
  improvedProcess: string;
  benefit: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListIdeasInput {
  page: number;
  pageSize: number;
}

export interface CreateIdeaInput {
  whatCanBeImproved: string;
  currentProcess: string;
  improvedProcess: string;
  benefit: string;
}

export type ListIdeasOutput = PaginatedResponse<Idea>;
