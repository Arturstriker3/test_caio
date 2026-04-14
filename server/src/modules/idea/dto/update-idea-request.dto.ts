import { z } from 'zod';
import { createIdeaRequestDtoSchema } from './create-idea-request.dto';

export const updateIdeaRequestDtoSchema = createIdeaRequestDtoSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'At least one field must be provided for update.');

export type UpdateIdeaRequestData = z.infer<typeof updateIdeaRequestDtoSchema>;

export class UpdateIdeaRequestDto {
  static readonly schema = updateIdeaRequestDtoSchema;

  whatCanBeImproved?: string;
  currentProcess?: string;
  improvedProcess?: string;
  benefit?: string;
}
