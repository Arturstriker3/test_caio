import toast from 'react-hot-toast';
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
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" disabled={deleteIdeaMutation.isPending} onClick={handleDelete}>
            {deleteIdeaMutation.isPending ? 'Excluindo...' : 'Confirmar exclusao'}
          </Button>
        </>
      }
    >
      <p className="text-sm text-muted-foreground leading-relaxed">
        Tem certeza que deseja excluir a ideia <strong className="text-foreground">{ideaTitle}</strong>?
      </p>
    </FadeModal>
  );
}
