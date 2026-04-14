import { z } from 'zod';

export const createIdeaFormSchema = z.object({
  whatCanBeImproved: z.string().trim().min(1, 'Informe o que pode ser melhorado.'),
  currentProcess: z.string().trim().min(1, 'Informe o processo atual.'),
  improvedProcess: z.string().trim().min(1, 'Informe o processo melhorado.'),
  benefit: z.string().trim().min(1, 'Informe o beneficio.'),
});

export type CreateIdeaFormData = z.infer<typeof createIdeaFormSchema>;
