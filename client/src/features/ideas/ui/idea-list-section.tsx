import { useListIdeasQuery } from '../hooks/use-list-ideas-query';

export function IdeaListSection() {
  const ideasQuery = useListIdeasQuery({ page: 1, pageSize: 10 });

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Ideias</h2>

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
  );
}
