import { z } from 'zod';

export const ideaIdParamDtoSchema = z.object({
  id: z.uuidv7('Idea id must be a valid UUID v7.'),
});

export type IdeaIdParamData = z.infer<typeof ideaIdParamDtoSchema>;

export class IdeaIdParamDto {
  static readonly schema = ideaIdParamDtoSchema;

  id!: string;
}
