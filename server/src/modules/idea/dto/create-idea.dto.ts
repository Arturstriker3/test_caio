import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';
import { IDEA_TEXT_MAX_LENGTH } from './idea.constants';

export const createIdeaDtoSchema = z.object({
  whatCanBeImproved: z.string().trim().min(1).max(IDEA_TEXT_MAX_LENGTH),
  currentProcess: z.string().trim().min(1).max(IDEA_TEXT_MAX_LENGTH),
  improvedProcess: z.string().trim().min(1).max(IDEA_TEXT_MAX_LENGTH),
  benefit: z.string().trim().min(1).max(IDEA_TEXT_MAX_LENGTH),
});

export type CreateIdeaDto = z.infer<typeof createIdeaDtoSchema>;

export function parseCreateIdeaDto(input: unknown): CreateIdeaDto {
  const parsed = createIdeaDtoSchema.safeParse(input);

  if (!parsed.success) {
    throw new BadRequestException(parsed.error.flatten());
  }

  return parsed.data;
}
