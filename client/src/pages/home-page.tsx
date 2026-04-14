import { PageShell } from '../components/page-shell';
import { CreateIdeaFormSection } from '../features/ideas/ui/create-idea-form-section';
import { IdeaListSection } from '../features/ideas/ui/idea-list-section';

export function HomePage() {
  return (
    <PageShell
      title="Ideas Dashboard"
      description="Estrutura modular com separacao por feature, repository para backend e hooks para regras de dados."
    >
      <CreateIdeaFormSection />
      <IdeaListSection />
    </PageShell>
  );
}
