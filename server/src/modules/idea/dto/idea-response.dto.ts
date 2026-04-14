import { IdeaEntity } from '../idea.entity';

export class IdeaResponseDto {
  constructor(
    public readonly id: string,
    public readonly whatCanBeImproved: string,
    public readonly currentProcess: string,
    public readonly improvedProcess: string,
    public readonly benefit: string,
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}

  static fromEntity(entity: IdeaEntity): IdeaResponseDto {
    return new IdeaResponseDto(
      entity.id,
      entity.whatCanBeImproved,
      entity.currentProcess,
      entity.improvedProcess,
      entity.benefit,
      entity.createdAt,
      entity.updatedAt,
    );
  }

  static fromEntities(entities: IdeaEntity[]): IdeaResponseDto[] {
    return entities.map((entity) => IdeaResponseDto.fromEntity(entity));
  }
}
