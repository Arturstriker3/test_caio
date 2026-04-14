import toast from 'react-hot-toast';
import { AlertTriangleIcon } from 'lucide-react';
import { FadeModal } from '../../../components/fade-modal';
import { Button } from '../../../components/ui/button';
import { useDeleteIdeaMutation } from '../hooks/use-delete-idea-mutation';

interface DeleteIdeaConfirmModalProps {
  isOpen: boolean;
  ideaId: string | null;
  ideaTitle: string;
  onClose: () => void;
}

export function DeleteIdeaConfirmModal({ isOpen, ideaId, ideaTitle, onClose }: DeleteIdeaConfirmModalProps) {
  const deleteIdeaMutation = useDeleteIdeaMutation();

  const handleDelete = async () => {
    if (!ideaId) {
      return;
    }

    try {
      await deleteIdeaMutation.mutateAsync({ id: ideaId });
      toast.success('Ideia excluida com sucesso.');
      onClose();
    } catch {
      toast.error('Nao foi possivel excluir a ideia.');
    }
  };

  return (
    <FadeModal
      isOpen={isOpen}
      onClose={onClose}
      title="Excluir ideia"
      description="Essa acao nao pode ser desfeita."
      mobileLayout="compact"
      footer={
        <>
          <Button className="w-full sm:w-auto" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            className="w-full sm:w-auto"
            variant="destructive"
            disabled={deleteIdeaMutation.isPending}
            onClick={handleDelete}
          >
            {deleteIdeaMutation.isPending ? 'Excluindo...' : 'Confirmar exclusao'}
          </Button>
        </>
      }
    >
      <div className="grid gap-4">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 rounded-full bg-destructive/15 p-1.5 text-destructive">
              <AlertTriangleIcon className="size-4" />
            </span>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Confirmacao de exclusao
              </p>
            </div>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Tem certeza que deseja excluir a ideia?
        </p>
        <p
          className="rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-sm font-semibold text-foreground break-words"
          title={ideaTitle}
        >
          {ideaTitle}
        </p>
      </div>
    </FadeModal>
  );
}
