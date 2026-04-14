import { httpRequest } from "../../../shared/http/http-client";
import type {
  CreateIdeaInput,
  Idea,
  ListIdeasInput,
  ListIdeasOutput,
} from "../types/idea.types";

export interface IdeaRepository {
  list(input: ListIdeasInput): Promise<ListIdeasOutput>;
  create(input: CreateIdeaInput): Promise<Idea>;
}

class HttpIdeaRepository implements IdeaRepository {
  async list(input: ListIdeasInput): Promise<ListIdeasOutput> {
    return httpRequest<ListIdeasOutput>("/ideas", {
      query: {
        page: input.page,
        pageSize: input.pageSize,
      },
    });
  }

  async create(input: CreateIdeaInput): Promise<Idea> {
    return httpRequest<Idea>("/ideas", {
      method: "POST",
      body: input,
    });
  }
}

export const ideaRepository: IdeaRepository = new HttpIdeaRepository();
