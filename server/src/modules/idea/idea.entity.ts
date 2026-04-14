import { ApiProperty } from '@nestjs/swagger';

export class IdeaEntity {
  @ApiProperty({ format: 'uuid', example: '018f3222-08b0-7f0d-a730-6f4f6b28f641' })
  public readonly id: string;

  @ApiProperty({ example: 'Padronizar o handoff entre times de produto e engenharia.' })
  public readonly whatCanBeImproved: string;

  @ApiProperty({ example: 'Handoff ocorre via mensagens soltas e sem template único.' })
  public readonly currentProcess: string;

  @ApiProperty({ example: 'Handoff via template com critérios claros e checklist.' })
  public readonly improvedProcess: string;

  @ApiProperty({ example: 'Redução de retrabalho e maior previsibilidade de entrega.' })
  public readonly benefit: string;

  @ApiProperty({ example: '2026-04-14T19:08:12.000Z' })
  public readonly createdAt: string;

  @ApiProperty({ example: '2026-04-14T19:30:48.000Z' })
  public readonly updatedAt: string;

  constructor(id: string, whatCanBeImproved: string, currentProcess: string, improvedProcess: string, benefit: string, createdAt: string, updatedAt: string) {
    this.id = id;
    this.whatCanBeImproved = whatCanBeImproved;
    this.currentProcess = currentProcess;
    this.improvedProcess = improvedProcess;
    this.benefit = benefit;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
