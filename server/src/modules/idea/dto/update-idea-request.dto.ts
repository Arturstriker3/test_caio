import { ApiPropertyOptional } from '@nestjs/swagger';
import { z } from 'zod';
import { createIdeaRequestDtoSchema } from './create-idea-request.dto';

export const updateIdeaRequestDtoSchema = createIdeaRequestDtoSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'At least one field must be provided for update.');

export type UpdateIdeaRequestData = z.infer<typeof updateIdeaRequestDtoSchema>;

export class UpdateIdeaRequestDto {
  static readonly schema = updateIdeaRequestDtoSchema;

  @ApiPropertyOptional({ example: 'Atualizar o fluxo de abertura de chamados internos.' })
  whatCanBeImproved?: string;

  @ApiPropertyOptional({ example: 'Solicitação por e-mail sem SLA definido.' })
  currentProcess?: string;

  @ApiPropertyOptional({ example: 'Portal único com SLA e notificações automáticas.' })
  improvedProcess?: string;

  @ApiPropertyOptional({ example: 'Melhor visibilidade e tempo de atendimento menor.' })
  benefit?: string;
}
