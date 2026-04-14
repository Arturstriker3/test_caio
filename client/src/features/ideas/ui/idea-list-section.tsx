import { useMemo, useRef, useState } from "react";
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
const SWIPE_ACTION_THRESHOLD = 28;
const MAX_SWIPE_OFFSET = 36;

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
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [swipeIdeaId, setSwipeIdeaId] = useState<string | null>(null);

  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const isHorizontalGestureRef = useRef(false);
  const blockNextTapRef = useRef(false);

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

  function handleTouchStart(
    ideaId: string,
    clientX: number,
    clientY: number,
  ): void {
    touchStartXRef.current = clientX;
    touchStartYRef.current = clientY;
    isHorizontalGestureRef.current = false;
    blockNextTapRef.current = false;
    setSwipeIdeaId(ideaId);
    setSwipeOffset(0);
  }

  function handleTouchMove(
    clientX: number,
    clientY: number,
    preventScroll?: () => void,
  ): void {
    const startX = touchStartXRef.current;
    const startY = touchStartYRef.current;
    if (startX === null || startY === null || swipeIdeaId === null) {
      return;
    }

    const deltaX = clientX - startX;
    const deltaY = clientY - startY;

    if (!isHorizontalGestureRef.current) {
      if (Math.abs(deltaX) < 12 || Math.abs(deltaX) < Math.abs(deltaY)) {
        return;
      }
      isHorizontalGestureRef.current = true;
      blockNextTapRef.current = true;
    }

    preventScroll?.();

    const limitedOffset = Math.max(
      -MAX_SWIPE_OFFSET,
      Math.min(MAX_SWIPE_OFFSET, deltaX),
    );
    setSwipeOffset(limitedOffset);
  }

  function resetSwipeState(): void {
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    isHorizontalGestureRef.current = false;
    setSwipeOffset(0);
    setSwipeIdeaId(null);
  }

  function handleTouchEnd(idea: Idea): void {
    if (swipeIdeaId !== idea.id) {
      resetSwipeState();
      return;
    }

    if (swipeOffset <= -SWIPE_ACTION_THRESHOLD) {
      setIdeaToDelete(idea);
      resetSwipeState();
      return;
    }

    if (swipeOffset >= SWIPE_ACTION_THRESHOLD) {
      setEditingIdea(idea);
      resetSwipeState();
      return;
    }

    resetSwipeState();
  }

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

          <CardContent className="space-y-4 px-3 sm:px-4">
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
              <>
                <div className="w-full min-w-0 overflow-hidden rounded-xl border border-border/70 bg-background md:hidden">
                  <ul className="w-full min-w-0 divide-y">
                    {ideasQuery.data.items.map((idea, index) => {
                      const rowNumber =
                        (summary.currentPage - 1) * pageSize + index + 1;
                      const isActiveSwipe = swipeIdeaId === idea.id;

                      return (
                        <li
                          key={idea.id}
                          className="relative w-full min-w-0 overflow-hidden"
                        >
                          <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 z-0"
                          >
                            <div className="absolute inset-y-0 left-0 flex w-8 items-center justify-center bg-emerald-500/15 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                              <span className="[writing-mode:vertical-rl] [text-orientation:mixed]">
                                Editar
                              </span>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex w-8 items-center justify-center bg-destructive/15 text-[10px] font-semibold uppercase tracking-wide text-destructive">
                              <span className="[writing-mode:vertical-rl] [text-orientation:mixed]">
                                Excluir
                              </span>
                            </div>
                          </div>

                          <button
                            className="relative z-10 block w-full min-w-0 max-w-full cursor-pointer touch-pan-y overflow-hidden bg-background p-4 text-left transition-transform"
                            onTouchStart={(event) => {
                              const touch = event.touches[0];
                              handleTouchStart(
                                idea.id,
                                touch.clientX,
                                touch.clientY,
                              );
                            }}
                            onTouchMove={(event) => {
                              const touch = event.touches[0];
                              handleTouchMove(
                                touch.clientX,
                                touch.clientY,
                                () => {
                                  if (event.cancelable) {
                                    event.preventDefault();
                                  }
                                },
                              );
                            }}
                            onTouchEnd={() => handleTouchEnd(idea)}
                            onTouchCancel={resetSwipeState}
                            onClick={() => {
                              if (blockNextTapRef.current) {
                                blockNextTapRef.current = false;
                                return;
                              }

                              setSelectedIdea(idea);
                            }}
                            style={{
                              transform:
                                isActiveSwipe && swipeOffset !== 0
                                  ? `translateX(${swipeOffset}px)`
                                  : undefined,
                            }}
                            data-swipeable="true"
                            type="button"
                          >
                            <div className="flex min-w-0 items-start gap-3">
                              <span className="mt-0.5 rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">
                                {rowNumber}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p
                                  className="truncate text-sm font-semibold"
                                  title={idea.whatCanBeImproved}
                                >
                                  {idea.whatCanBeImproved}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  Toque para visualizar, deslize para acoes
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 grid min-w-0 grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                              <p className="min-w-0 truncate">
                                <span className="font-medium text-foreground">
                                  Criado:
                                </span>{" "}
                                {formatDateTime(idea.createdAt)}
                              </p>
                              <p className="min-w-0 truncate">
                                <span className="font-medium text-foreground">
                                  Editado:
                                </span>{" "}
                                {formatDateTime(idea.updatedAt)}
                              </p>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="hidden overflow-hidden rounded-xl border border-border/70 bg-background md:block">
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
                        const rowNumber =
                          (summary.currentPage - 1) * pageSize + index + 1;

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
              </>
            ) : null}

            <footer className="flex items-center justify-between gap-2 overflow-hidden rounded-xl bg-muted/40 px-2.5 py-3 sm:gap-3 sm:px-4">
              <p className="min-w-0 flex-1 text-sm text-muted-foreground">
                <span className="sm:hidden">
                  {summary.currentPage} de {summary.totalPages}
                </span>
                <span className="hidden sm:inline">
                  Pagina {summary.currentPage} de {summary.totalPages}
                </span>
              </p>

              <div className="hidden min-w-0 max-w-full items-center justify-end gap-2 sm:flex">
                <div className="flex min-w-0 items-center gap-1.5 text-sm">
                  <Select
                    value={String(pageSize)}
                    onValueChange={(value) => {
                      const nextPageSize = Number(value);
                      setPageSize(nextPageSize);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="h-9 w-12 sm:h-10 sm:w-20">
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

                <div className="hidden items-center gap-2 sm:flex">
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
