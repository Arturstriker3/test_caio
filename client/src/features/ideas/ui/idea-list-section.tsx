import { useMemo, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { useListIdeasQuery } from "../hooks/use-list-ideas-query";
import type { Idea } from "../types/idea.types";
import { DeleteIdeaConfirmModal } from "./delete-idea-confirm-modal";
import { EditIdeaModal } from "./edit-idea-modal";
import { ViewIdeaModal } from "./view-idea-modal";

const PAGE_SIZE_OPTIONS = [5, 10, 15];

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function IdeaListSection() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const ideasQuery = useListIdeasQuery({ page, pageSize });

  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [ideaToDelete, setIdeaToDelete] = useState<Idea | null>(null);

  const pagination = ideasQuery.data?.meta;

  const summary = useMemo(
    () => ({
      totalIdeas: pagination?.totalItems ?? 0,
      currentPage: pagination?.page ?? page,
      totalPages: pagination?.totalPages ?? 1,
    }),
    [pagination, page],
  );

  const hasPreviousPage = Boolean(pagination?.hasPreviousPage);
  const hasNextPage = Boolean(pagination?.hasNextPage);

  return (
    <>
      <section className="fade-in-up" style={{ animationDelay: "80ms" }}>
        <Card className="app-card overflow-hidden border-border/70 shadow-[0_12px_40px_-18px_rgba(15,23,42,0.35)]">
          <CardHeader className="border-b bg-gradient-to-r from-muted/40 via-background to-background">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <CardTitle>Ideias cadastradas</CardTitle>
              <p className="text-sm text-muted-foreground">
                {summary.totalIdeas} itens
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {ideasQuery.isLoading ? (
              <p className="text-sm text-muted-foreground">
                Carregando ideias...
              </p>
            ) : null}

            {ideasQuery.isError ? (
              <p className="text-sm text-destructive">
                Erro ao carregar ideias. Verifique se o backend esta rodando.
              </p>
            ) : null}

            {ideasQuery.data ? (
              <div className="overflow-hidden rounded-xl border border-border/70 bg-background">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[72px]">#</TableHead>
                      <TableHead>Nome da ideia</TableHead>
                      <TableHead className="w-[140px]">Criado</TableHead>
                      <TableHead className="w-[140px]">Editado</TableHead>
                      <TableHead className="w-[170px] text-right">
                        Acoes
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ideasQuery.data.items.map((idea, index) => {
                      const rowNumber = (summary.currentPage - 1) * pageSize + index + 1;

                      return (
                        <TableRow
                          key={idea.id}
                          className="cursor-pointer hover:bg-primary/5"
                          onClick={() => setSelectedIdea(idea)}
                        >
                          <TableCell className="font-medium text-muted-foreground">
                            {rowNumber}
                          </TableCell>
                          <TableCell className="font-medium transition-colors hover:text-primary">
                            <span
                              className="block max-w-[48vw] truncate sm:max-w-[420px] lg:max-w-[520px]"
                              title={idea.whatCanBeImproved}
                            >
                              {idea.whatCanBeImproved}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDateTime(idea.createdAt)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDateTime(idea.updatedAt)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setSelectedIdea(idea);
                                }}
                              >
                                <EyeIcon className="size-4" />
                                <span className="sr-only">
                                  Visualizar ideia
                                </span>
                              </Button>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setEditingIdea(idea);
                                }}
                              >
                                <PencilIcon className="size-4" />
                                <span className="sr-only">Editar ideia</span>
                              </Button>
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  setIdeaToDelete(idea);
                                }}
                              >
                                <Trash2Icon className="size-4 text-destructive" />
                                <span className="sr-only">Excluir ideia</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : null}

            <footer className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/40 px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Pagina {summary.currentPage} de {summary.totalPages}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Por pagina</span>
                  <Select
                    value={String(pageSize)}
                    onValueChange={(value) => {
                      const nextPageSize = Number(value);
                      setPageSize(nextPageSize);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue placeholder="Tamanho" />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={String(option)}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="icon-sm"
                    variant="outline"
                    disabled={!hasPreviousPage}
                    onClick={() =>
                      setPage((current) => Math.max(1, current - 1))
                    }
                  >
                    <ChevronLeftIcon className="size-4" />
                    <span className="sr-only">Pagina anterior</span>
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="outline"
                    disabled={!hasNextPage}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    <ChevronRightIcon className="size-4" />
                    <span className="sr-only">Proxima pagina</span>
                  </Button>
                </div>
              </div>
            </footer>
          </CardContent>
        </Card>
      </section>

      <ViewIdeaModal
        isOpen={Boolean(selectedIdea)}
        idea={selectedIdea}
        onClose={() => setSelectedIdea(null)}
      />
      <EditIdeaModal
        isOpen={Boolean(editingIdea)}
        idea={editingIdea}
        onClose={() => setEditingIdea(null)}
      />

      <DeleteIdeaConfirmModal
        isOpen={Boolean(ideaToDelete)}
        ideaId={ideaToDelete?.id ?? null}
        ideaTitle={ideaToDelete?.whatCanBeImproved ?? "esta ideia"}
        onClose={() => setIdeaToDelete(null)}
      />
    </>
  );
}
