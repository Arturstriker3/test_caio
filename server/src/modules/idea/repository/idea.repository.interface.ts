import type { CreateIdeaDto } from '../dto/create-idea.dto';
import type { UpdateIdeaDto } from '../dto/update-idea.dto';
import type { IdeaEntity } from '../idea.entity';

export const IDEA_REPOSITORY = Symbol('IDEA_REPOSITORY');

export interface IdeaRepository {
  findAll(): Promise<IdeaEntity[]>;
  findById(id: string): Promise<IdeaEntity | null>;
  create(input: CreateIdeaDto): Promise<IdeaEntity>;
  update(id: string, input: UpdateIdeaDto): Promise<IdeaEntity | null>;
  delete(id: string): Promise<boolean>;
}
