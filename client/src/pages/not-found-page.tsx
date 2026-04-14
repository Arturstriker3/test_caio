import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Pagina nao encontrada</h1>
        <p className="mt-2 text-sm text-slate-600">A rota que voce tentou acessar nao existe.</p>
        <Link className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline" to="/">
          Voltar para Home
        </Link>
      </div>
    </main>
  );
}
