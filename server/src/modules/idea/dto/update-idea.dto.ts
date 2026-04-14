import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { createIdeaDtoSchema } from './create-idea.dto';

export const updateIdeaDtoSchema = createIdeaDtoSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, 'At least one field must be provided for update.');

export type UpdateIdeaDto = z.infer<typeof updateIdeaDtoSchema>;

export function parseUpdateIdeaDto(input: unknown): UpdateIdeaDto {
  const parsed = updateIdeaDtoSchema.safeParse(input);

  if (!parsed.success) {
    throw new BadRequestException(parsed.error.flatten());
  }

  return parsed.data;
}
