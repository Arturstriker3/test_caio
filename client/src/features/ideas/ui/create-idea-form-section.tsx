import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createIdeaFormSchema, type CreateIdeaFormData } from '../schemas/create-idea-form.schema';
import { useCreateIdeaMutation } from '../hooks/use-create-idea-mutation';

export function CreateIdeaFormSection() {
  const createIdeaMutation = useCreateIdeaMutation();

  const { register, handleSubmit, formState, reset } = useForm<CreateIdeaFormData>({
    resolver: zodResolver(createIdeaFormSchema),
    defaultValues: {
      whatCanBeImproved: '',
      currentProcess: '',
      improvedProcess: '',
      benefit: '',
    },
  });

  const onSubmit = async (data: CreateIdeaFormData) => {
    try {
      await createIdeaMutation.mutateAsync(data);
      toast.success('Ideia criada com sucesso.');
      reset();
    } catch {
      toast.error('Nao foi possivel criar a ideia.');
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Nova ideia</h2>

      <form className="mt-4 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="whatCanBeImproved">
            O que pode melhorar
          </label>
          <input
            id="whatCanBeImproved"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            {...register('whatCanBeImproved')}
          />
          <span className="text-xs text-red-600">{formState.errors.whatCanBeImproved?.message}</span>
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="currentProcess">
            Processo atual
          </label>
          <input
            id="currentProcess"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            {...register('currentProcess')}
          />
          <span className="text-xs text-red-600">{formState.errors.currentProcess?.message}</span>
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="improvedProcess">
            Processo melhorado
          </label>
          <input
            id="improvedProcess"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            {...register('improvedProcess')}
          />
          <span className="text-xs text-red-600">{formState.errors.improvedProcess?.message}</span>
        </div>

        <div className="grid gap-1">
          <label className="text-sm font-medium text-slate-700" htmlFor="benefit">
            Beneficio
          </label>
          <input
            id="benefit"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm"
            {...register('benefit')}
          />
          <span className="text-xs text-red-600">{formState.errors.benefit?.message}</span>
        </div>

        <div>
          <Button colorPalette="blue" type="submit" loading={createIdeaMutation.isPending}>
            Criar ideia
          </Button>
        </div>
      </form>
    </section>
  );
}
