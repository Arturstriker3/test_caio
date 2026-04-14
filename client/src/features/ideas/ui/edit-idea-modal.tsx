import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FadeModal } from '../../../components/fade-modal';
import { Button } from '../../../components/ui/button';
import { useUpdateIdeaMutation } from '../hooks/use-update-idea-mutation';
import { createIdeaFormSchema, type CreateIdeaFormData } from '../schemas/create-idea-form.schema';
import type { Idea } from '../types/idea.types';
import { IdeaFormFields } from './idea-form-fields';

interface EditIdeaModalProps {
  isOpen: boolean;
  idea: Idea | null;
  onClose: () => void;
}

export function EditIdeaModal({ isOpen, idea, onClose }: EditIdeaModalProps) {
  const updateIdeaMutation = useUpdateIdeaMutation();

  const { register, handleSubmit, formState, reset, control } = useForm<CreateIdeaFormData>({
    resolver: zodResolver(createIdeaFormSchema),
    defaultValues: {
      whatCanBeImproved: '',
      currentProcess: '',
      improvedProcess: '',
      benefit: '',
    },
  });

  const formValues = useWatch({ control });

  useEffect(() => {
    if (!idea) {
      return;
    }

    reset({
      whatCanBeImproved: idea.whatCanBeImproved,
      currentProcess: idea.currentProcess,
      improvedProcess: idea.improvedProcess,
      benefit: idea.benefit,
    });
  }, [idea, reset]);

  const onSubmit = async (data: CreateIdeaFormData) => {
    if (!idea) {
      return;
    }

    try {
      await updateIdeaMutation.mutateAsync({ id: idea.id, ...data });
      toast.success('Ideia atualizada com sucesso.');
      onClose();
    } catch {
      toast.error('Nao foi possivel atualizar a ideia.');
    }
  };

  return (
    <FadeModal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar ideia"
      description="Atualize os campos abaixo e salve as alteracoes."
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={updateIdeaMutation.isPending} onClick={handleSubmit(onSubmit)}>
            {updateIdeaMutation.isPending ? 'Salvando...' : 'Salvar alteracoes'}
          </Button>
        </>
      }
    >
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <IdeaFormFields register={register} errors={formState.errors} values={formValues} idPrefix="edit-idea" />
      </form>
    </FadeModal>
  );
}
