import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FadeModal } from '../../../components/fade-modal';
import { Button } from '../../../components/ui/button';
import { useCreateIdeaMutation } from '../hooks/use-create-idea-mutation';
import { createIdeaFormSchema, type CreateIdeaFormData } from '../schemas/create-idea-form.schema';
import { IdeaFormFields } from './idea-form-fields';

interface AddIdeaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddIdeaModal({ isOpen, onClose }: AddIdeaModalProps) {
  const createIdeaMutation = useCreateIdeaMutation();

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

  const closeAndReset = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateIdeaFormData) => {
    try {
      await createIdeaMutation.mutateAsync(data);
      toast.success('Ideia criada com sucesso.');
      closeAndReset();
    } catch {
      toast.error('Nao foi possivel criar a ideia.');
    }
  };

  return (
    <FadeModal
      isOpen={isOpen}
      onClose={closeAndReset}
      title="Nova ideia"
      description="Registre uma melhoria com contexto, proposta e beneficio esperado."
      footer={
        <>
          <Button variant="outline" onClick={closeAndReset}>
            Cancelar
          </Button>
          <Button disabled={createIdeaMutation.isPending} onClick={handleSubmit(onSubmit)}>
            {createIdeaMutation.isPending ? 'Salvando...' : 'Salvar ideia'}
          </Button>
        </>
      }
    >
      <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <IdeaFormFields register={register} errors={formState.errors} values={formValues} idPrefix="add-idea" />
      </form>
    </FadeModal>
  );
}
