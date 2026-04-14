import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { listIdeas } from '../modules/idea/api/list-ideas';

const createIdeaSchema = z.object({
  whatCanBeImproved: z.string().trim().min(1, 'Informe o que pode ser melhorado.'),
  currentProcess: z.string().trim().min(1, 'Informe o processo atual.'),
  improvedProcess: z.string().trim().min(1, 'Informe o processo melhorado.'),
  benefit: z.string().trim().min(1, 'Informe o beneficio.'),
});

type CreateIdeaFormData = z.infer<typeof createIdeaSchema>;

export function HomePage() {
  const { register, handleSubmit, formState, reset } = useForm<CreateIdeaFormData>({
    resolver: zodResolver(createIdeaSchema),
    defaultValues: {
      whatCanBeImproved: '',
      currentProcess: '',
      improvedProcess: '',
      benefit: '',
    },
  });

  const ideasQuery = useQuery({
    queryKey: ['ideas', 1, 5],
    queryFn: () => listIdeas({ page: 1, pageSize: 5 }),
  });

  const onSubmit = (data: CreateIdeaFormData) => {
    void data;
    toast.success('Formulario validado com sucesso. Integracao de create pode ser o proximo passo.');
    reset();
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-8">
      <header className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Client Base Setup</h1>
        <p className="mt-2 text-sm text-slate-600">
          Stack pronta: React + Vite + TypeScript, TanStack Query, React Hook Form, Zod, React Router,
          Tailwind v4, Chakra UI e Toast.
        </p>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Ideias (TanStack Query)</h2>

        {ideasQuery.isLoading ? <p className="mt-3 text-sm text-slate-600">Carregando ideias...</p> : null}
        {ideasQuery.isError ? (
          <p className="mt-3 text-sm text-red-600">Erro ao carregar ideias. Verifique se o server esta rodando.</p>
        ) : null}

        {ideasQuery.data ? (
          <>
            <p className="mt-3 text-sm text-slate-600">
              Total: <strong>{ideasQuery.data.meta.totalItems}</strong> - Pagina {ideasQuery.data.meta.page} de{' '}
              {ideasQuery.data.meta.totalPages}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {ideasQuery.data.items.map((idea) => (
                <li key={idea.id}>{idea.whatCanBeImproved}</li>
              ))}
            </ul>
          </>
        ) : null}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Formulario (React Hook Form + Zod)</h2>

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
            <Button colorPalette="blue" type="submit">
              Validar formulario
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
