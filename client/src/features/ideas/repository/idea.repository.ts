import { httpRequest } from '../../../shared/http/http-client';
import type {
  CreateIdeaInput,
  DeleteIdeaInput,
  Idea,
  ListIdeasInput,
  ListIdeasOutput,
  UpdateIdeaInput,
} from '../types/idea.types';

export interface IdeaRepository {
  list(input: ListIdeasInput): Promise<ListIdeasOutput>;
  create(input: CreateIdeaInput): Promise<Idea>;
  update(input: UpdateIdeaInput): Promise<Idea>;
  remove(input: DeleteIdeaInput): Promise<void>;
}

class HttpIdeaRepository implements IdeaRepository {
  async list(input: ListIdeasInput): Promise<ListIdeasOutput> {
    return httpRequest<ListIdeasOutput>('/ideas', {
      query: {
        page: input.page,
        pageSize: input.pageSize,
      },
    });
  }

  async create(input: CreateIdeaInput): Promise<Idea> {
    return httpRequest<Idea>('/ideas', {
      method: 'POST',
      body: input,
    });
  }

  async update(input: UpdateIdeaInput): Promise<Idea> {
    const { id, ...payload } = input;

    return httpRequest<Idea>(`/ideas/${id}`, {
      method: 'PATCH',
      body: payload,
    });
  }

  async remove(input: DeleteIdeaInput): Promise<void> {
    await httpRequest<void>(`/ideas/${input.id}`, {
      method: 'DELETE',
    });
  }
}

export const ideaRepository: IdeaRepository = new HttpIdeaRepository();
