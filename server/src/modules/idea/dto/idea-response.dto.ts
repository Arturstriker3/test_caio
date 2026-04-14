import { ApiProperty } from '@nestjs/swagger';
import { IdeaEntity } from '../idea.entity';

export class IdeaResponseDto {
  @ApiProperty({ format: 'uuid', example: '018f3222-08b0-7f0d-a730-6f4f6b28f641' })
  public readonly id: string;

  @ApiProperty({ example: 'Melhorar onboarding técnico para novos devs.' })
  public readonly whatCanBeImproved: string;

  @ApiProperty({ example: 'Onboarding sem trilha definida e com informações dispersas.' })
  public readonly currentProcess: string;

  @ApiProperty({ example: 'Trilha de onboarding com etapas, mentoria e checkpoints.' })
  public readonly improvedProcess: string;

  @ApiProperty({ example: 'Ramp-up mais rápido e menos dúvidas recorrentes.' })
  public readonly benefit: string;

  @ApiProperty({ example: '2026-04-14T19:08:12.000Z' })
  public readonly createdAt: string;

  @ApiProperty({ example: '2026-04-14T19:30:48.000Z' })
  public readonly updatedAt: string;

  constructor(
    id: string,
    whatCanBeImproved: string,
    currentProcess: string,
    improvedProcess: string,
    benefit: string,
    createdAt: string,
    updatedAt: string,
  ) {
    this.id = id;
    this.whatCanBeImproved = whatCanBeImproved;
    this.currentProcess = currentProcess;
    this.improvedProcess = improvedProcess;
    this.benefit = benefit;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

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
