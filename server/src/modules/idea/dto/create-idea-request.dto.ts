import { ApiProperty } from '@nestjs/swagger';
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

  @ApiProperty({ example: 'Melhorar o fluxo de deploy para reduzir falhas em produção.' })
  whatCanBeImproved!: string;

  @ApiProperty({ example: 'Deploy manual feito por checklist em planilha.' })
  currentProcess!: string;

  @ApiProperty({ example: 'Deploy automatizado por pipeline CI/CD com validações.' })
  improvedProcess!: string;

  @ApiProperty({ example: 'Menor lead time e redução de incidentes em produção.' })
  benefit!: string;
}
