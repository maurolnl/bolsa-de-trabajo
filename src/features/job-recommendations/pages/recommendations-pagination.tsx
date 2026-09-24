import { Button } from "@/components/ui/button";

import { RecommendationPageInfo } from "../models/job-recommendation";

type RecommendationsPaginationProps = {
  page: RecommendationPageInfo;
  onOffsetChange: (offset: number) => void;
};

// El recorrido se deriva del total que la respuesta informa: el backend lo calcula sobre el
// conjunto vigente ya filtrado, así que el cliente sabe cuándo dejar de pedir páginas sin
// tener que descubrirlo con una respuesta vacía.
export const RecommendationsPagination = ({
  page,
  onOffsetChange,
}: RecommendationsPaginationProps) => {
  const totalPages = Math.max(1, Math.ceil(page.total / page.limit));
  const currentPage = Math.floor(page.offset / page.limit) + 1;
  const hasPrevious = page.offset > 0;
  const hasNext = page.offset + page.limit < page.total;

  if (totalPages <= 1) return null;

  return (
    <nav
      className="flex items-center justify-between gap-3"
      aria-label="Paginación de recomendaciones"
    >
      <Button
        variant="outline"
        disabled={!hasPrevious}
        onClick={() => onOffsetChange(Math.max(0, page.offset - page.limit))}
      >
        Anterior
      </Button>
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Página {currentPage} de {totalPages}
      </p>
      <Button
        variant="outline"
        disabled={!hasNext}
        onClick={() => onOffsetChange(page.offset + page.limit)}
      >
        Siguiente
      </Button>
    </nav>
  );
};
