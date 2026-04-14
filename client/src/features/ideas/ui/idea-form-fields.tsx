import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { IDEA_FIELD_LIMITS, type CreateIdeaFormData } from '../schemas/create-idea-form.schema';

interface IdeaFormFieldsProps {
  register: UseFormRegister<CreateIdeaFormData>;
  errors: FieldErrors<CreateIdeaFormData>;
  values: Partial<CreateIdeaFormData>;
  idPrefix?: string;
}

interface FieldMeta {
  key: keyof CreateIdeaFormData;
  label: string;
  limit: number;
  rows: number;
}

const FIELD_METAS: FieldMeta[] = [
  {
    key: 'whatCanBeImproved',
    label: 'Nome da ideia',
    limit: IDEA_FIELD_LIMITS.whatCanBeImproved,
    rows: 1,
  },
  {
    key: 'currentProcess',
    label: 'Processo atual',
    limit: IDEA_FIELD_LIMITS.currentProcess,
    rows: 3,
  },
  {
    key: 'improvedProcess',
    label: 'Processo melhorado',
    limit: IDEA_FIELD_LIMITS.improvedProcess,
    rows: 3,
  },
  {
    key: 'benefit',
    label: 'Beneficio esperado',
    limit: IDEA_FIELD_LIMITS.benefit,
    rows: 3,
  },
];

export function IdeaFormFields({ register, errors, values, idPrefix = 'idea' }: IdeaFormFieldsProps) {
  return (
    <>
      {FIELD_METAS.map((field) => {
        const fieldId = `${idPrefix}-${field.key}`;
        const currentLength = values[field.key]?.length ?? 0;
        const counterTone = currentLength >= field.limit * 0.9 ? 'text-amber-600' : 'text-muted-foreground';

        return (
          <div className="grid gap-2" key={field.key}>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor={fieldId}>{field.label}</Label>
              <span className={`text-xs font-medium ${counterTone}`}>
                {currentLength}/{field.limit}
              </span>
            </div>

            <Textarea
              id={fieldId}
              rows={field.rows}
              maxLength={field.limit}
              className="resize-y"
              {...register(field.key)}
            />

            <span className="min-h-4 text-xs text-destructive">{errors[field.key]?.message}</span>
          </div>
        );
      })}
    </>
  );
}
