import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { PageShell } from '../components/page-shell';
import { Button } from '../components/ui/button';
import { AddIdeaModal } from '../features/ideas/ui/add-idea-modal';
import { IdeaListSection } from '../features/ideas/ui/idea-list-section';

export function HomePage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <PageShell
      title="D+Ideias Dashboard"
      description="Gerencie ideias de melhoria com um fluxo completo de criacao, visualizacao, edicao e exclusao."
      headerAction={
        <Button className="w-full sm:w-auto" onClick={() => setIsAddModalOpen(true)}>
          <PlusIcon className="size-4" />
          Nova ideia
        </Button>
      }
    >
      <section className="grid gap-6">
        <IdeaListSection />
      </section>

      <AddIdeaModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </PageShell>
  );
}
