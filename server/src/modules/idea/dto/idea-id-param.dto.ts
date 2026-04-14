import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const ideaIdParamDtoSchema = z.object({
  id: z.uuid('Idea id must be a valid UUID.'),
});

export type IdeaIdParamData = z.infer<typeof ideaIdParamDtoSchema>;

export class IdeaIdParamDto {
  static readonly schema = ideaIdParamDtoSchema;

  @ApiProperty({
    format: 'uuid',
    example: '018f3222-08b0-7f0d-a730-6f4f6b28f641',
    description: 'Idea UUID identifier.',
  })
  id!: string;
}
