import type { ReactNode } from 'react';

interface PageShellProps {
  title: string;
  description: string;
  headerAction?: ReactNode;
  children: ReactNode;
}

export function PageShell({ title, description, headerAction, children }: PageShellProps) {
  return (
    <main className="page-shell flex min-h-screen flex-col gap-6 overflow-x-hidden">
      <header className="fade-in-up grid gap-4">
        <div className="app-card overflow-hidden p-0">
          <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-indigo-50 p-5 md:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">D+IDEIAS</p>
                <h1 className="app-title text-2xl font-bold md:text-3xl">{title}</h1>
                <p className="app-subtitle max-w-3xl text-sm md:text-base">{description}</p>
              </div>

              {headerAction ? <div className="w-full sm:w-auto">{headerAction}</div> : null}
            </div>
          </div>
        </div>
      </header>

      {children}
    </main>
  );
}
