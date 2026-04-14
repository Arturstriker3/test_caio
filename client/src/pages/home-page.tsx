import { useQueryClient } from "@tanstack/react-query";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import { useState } from "react";
import { PageShell } from "../components/page-shell";
import { Button } from "../components/ui/button";
import { ideaQueryKeys } from "../features/ideas/hooks/idea-query-keys";
import { AddIdeaModal } from "../features/ideas/ui/add-idea-modal";
import { IdeaListSection } from "../features/ideas/ui/idea-list-section";

export function HomePage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleRefreshIdeas = async () => {
    await queryClient.refetchQueries({ queryKey: ideaQueryKeys.all, type: "active" });
  };

  return (
    <PageShell
      title="D+Ideias Dashboard"
      description="Gerencie ideias de melhoria com um fluxo completo de criacao, visualizacao, edicao e exclusao."
      headerAction={
        <div className="grid w-full gap-2 sm:w-auto">
          <Button
            className="w-full sm:w-auto"
            onClick={() => setIsAddModalOpen(true)}
          >
            <PlusIcon className="size-4" />
            Nova ideia
          </Button>
          <Button
            className="w-full sm:w-auto"
            variant="outline"
            onClick={handleRefreshIdeas}
          >
            <RefreshCwIcon className="size-4" />
            Recarregar
          </Button>
        </div>
      }
    >
      <section className="grid min-w-0 gap-6">
        <IdeaListSection />
      </section>

      <AddIdeaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </PageShell>
  );
}
