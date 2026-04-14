import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

const uuidV7Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const ideaIdSchema = z
  .string()
  .trim()
  .regex(uuidV7Regex, 'Idea id must be a valid UUID v7.');

export type IdeaIdDto = z.infer<typeof ideaIdSchema>;

export function parseIdeaIdDto(input: unknown): IdeaIdDto {
  const parsed = ideaIdSchema.safeParse(input);

  if (!parsed.success) {
    throw new BadRequestException(parsed.error.flatten());
  }

  return parsed.data;
}
