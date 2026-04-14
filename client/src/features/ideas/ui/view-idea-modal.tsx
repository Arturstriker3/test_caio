import { FadeModal } from '../../../components/fade-modal';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import type { Idea } from '../types/idea.types';

interface ViewIdeaModalProps {
  isOpen: boolean;
  idea: Idea | null;
  onClose: () => void;
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

export function ViewIdeaModal({ isOpen, idea, onClose }: ViewIdeaModalProps) {
  return (
    <FadeModal
      isOpen={isOpen}
      onClose={onClose}
      title={idea?.whatCanBeImproved ?? 'Detalhes da ideia'}
      description="Visualizacao completa da ideia selecionada."
      footer={
        <Button onClick={onClose}>
          Fechar
        </Button>
      }
    >
      {idea ? (
        <div className="grid gap-3 text-sm text-muted-foreground">
          <Card>
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Processo atual</p>
              <p className="mt-2 text-foreground leading-relaxed">{idea.currentProcess}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Processo melhorado</p>
              <p className="mt-2 text-foreground leading-relaxed">{idea.improvedProcess}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Beneficio esperado</p>
              <p className="mt-2 text-foreground leading-relaxed">{idea.benefit}</p>
            </CardContent>
          </Card>

          <div className="grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
            <p>Criado em: {formatDateTime(idea.createdAt)}</p>
            <p>Atualizado em: {formatDateTime(idea.updatedAt)}</p>
          </div>
        </div>
      ) : null}
    </FadeModal>
  );
}
