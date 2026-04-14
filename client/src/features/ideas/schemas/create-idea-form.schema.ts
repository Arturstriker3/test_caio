import { z } from 'zod';

export const IDEA_FIELD_LIMITS = {
  whatCanBeImproved: 180,
  currentProcess: 360,
  improvedProcess: 360,
  benefit: 360,
} as const;

export const createIdeaFormSchema = z.object({
  whatCanBeImproved: z
    .string()
    .trim()
    .min(1, 'Informe o que pode ser melhorado.')
    .max(IDEA_FIELD_LIMITS.whatCanBeImproved, `Limite de ${IDEA_FIELD_LIMITS.whatCanBeImproved} caracteres.`),
  currentProcess: z
    .string()
    .trim()
    .min(1, 'Informe o processo atual.')
    .max(IDEA_FIELD_LIMITS.currentProcess, `Limite de ${IDEA_FIELD_LIMITS.currentProcess} caracteres.`),
  improvedProcess: z
    .string()
    .trim()
    .min(1, 'Informe o processo melhorado.')
    .max(IDEA_FIELD_LIMITS.improvedProcess, `Limite de ${IDEA_FIELD_LIMITS.improvedProcess} caracteres.`),
  benefit: z
    .string()
    .trim()
    .min(1, 'Informe o beneficio.')
    .max(IDEA_FIELD_LIMITS.benefit, `Limite de ${IDEA_FIELD_LIMITS.benefit} caracteres.`),
});

export type CreateIdeaFormData = z.infer<typeof createIdeaFormSchema>;
