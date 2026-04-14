import { z } from 'zod';

export const createIdeaRequestDtoSchema = z.object({
  whatCanBeImproved: z.string().trim().min(1).max(720),
  currentProcess: z.string().trim().min(1).max(360),
  improvedProcess: z.string().trim().min(1).max(360),
  benefit: z.string().trim().min(1).max(360),
});

export type CreateIdeaRequestData = z.infer<typeof createIdeaRequestDtoSchema>;

export class CreateIdeaRequestDto {
  static readonly schema = createIdeaRequestDtoSchema;

  whatCanBeImproved!: string;
  currentProcess!: string;
  improvedProcess!: string;
  benefit!: string;
}
