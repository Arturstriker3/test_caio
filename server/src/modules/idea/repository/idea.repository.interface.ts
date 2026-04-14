import type { CreateIdeaRequestData } from '../dto/create-idea-request.dto';
import type { UpdateIdeaRequestData } from '../dto/update-idea-request.dto';
import type { IdeaEntity } from '../idea.entity';

export const IDEA_REPOSITORY = Symbol('IDEA_REPOSITORY');

export interface IdeaRepository {
  findAll(): Promise<IdeaEntity[]>;
  findById(id: string): Promise<IdeaEntity | null>;
  create(input: CreateIdeaRequestData): Promise<IdeaEntity>;
  update(id: string, input: UpdateIdeaRequestData): Promise<IdeaEntity | null>;
  delete(id: string): Promise<boolean>;
}
