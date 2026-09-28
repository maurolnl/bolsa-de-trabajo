import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { RecommendationsPagination } from "@/features/recommendations/components/recommendations-pagination";
import { RecommendationsState } from "@/features/recommendations/components/recommendations-state";
import { isGenerationInProgress } from "@/features/recommendations/models/recommendation-status";
import { PATHS } from "@/router/paths";

import {
  CANDIDATES_PAGE_SIZE,
  isForbiddenCandidatesError,
  isMissingJobPositionCandidatesError,
  useEmployeeRecommendations,
} from "../hooks/use-employee-recommendations";
import { EmployeeRecommendation } from "../models/employee-recommendation";
import { CandidateProfileSheet } from "./candidate-profile-sheet";
import { EmployeeRecommendationCard } from "./employee-recommendation-card";

// El identificador del puesto sale de la ruta, a diferencia del sentido del empleado, donde
// el sujeto se deriva del perfil propio: un empleador tiene N puestos y mira el de la URL.
// No debilita la autorización, que vive en el backend: compara el dueño del puesto contra el
// usuario del token y responde 403 a un puesto ajeno.
export const EmployeeRecommendationsPage = () => {
  const { jobPositionId } = useParams();
  const numericJobPositionId = Number(jobPositionId);

  if (!Number.isFinite(numericJobPositionId) || numericJobPositionId <= 0) {
    return <UnavailableJobPositionState />;
  }

  return <CandidatesList jobPositionId={numericJobPositionId} />;
};

// El puesto eliminado y el inexistente comparten pantalla porque el backend los hace
// indistinguibles a propósito: la resolución de propiedad excluye los eliminados, así que los
// dos responden 404. Inventar dos textos afirmaría una diferencia que el frontend no observa.
const UnavailableJobPositionState = () => {
  const navigate = useNavigate();

  return (
    <RecommendationsState
      title="Este puesto ya no está disponible"
      description="No encontramos el puesto que estabas mirando. Puede que lo hayas eliminado."
      action={
        <Button
          variant="outline"
          onClick={() => navigate(PATHS.main.employer.jobs)}
        >
          Volver a mis puestos
        </Button>
      }
    />
  );
};

const CandidatesList = ({ jobPositionId }: { jobPositionId: number }) => {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<EmployeeRecommendation | null>(null);
  const candidates = useEmployeeRecommendations(jobPositionId, offset);

  const total = candidates.data?.page.total;

  // El conjunto puede achicarse entre dos generaciones y dejar el tramo actual fuera de
  // rango. Volver al comienzo evita quedarse mirando una página vacía que no es el
  // resultado real.
  useEffect(() => {
    if (total !== undefined && offset > 0 && offset >= total) {
      setOffset(0);
    }
  }, [total, offset]);

  if (candidates.isPending) {
    return <LoadingScreen />;
  }

  if (candidates.isError) {
    // Un 404 significa puesto inexistente o eliminado; ninguno se resuelve reintentando.
    if (isMissingJobPositionCandidatesError(candidates.error)) {
      return <UnavailableJobPositionState />;
    }

    // Un 403 significa rol incorrecto o puesto ajeno: la API ya lo rechazó por autorización
    // y reintentar no lo cambia.
    if (isForbiddenCandidatesError(candidates.error)) {
      return (
        <RecommendationsState
          title="No pudimos mostrarte estos candidatos"
          description="Esta sección está disponible solo para los puestos que vos publicaste."
          action={
            <Button
              variant="outline"
              onClick={() => navigate(PATHS.main.employer.jobs)}
            >
              Volver a mis puestos
            </Button>
          }
        />
      );
    }

    return (
      <RecommendationsState
        title="No pudimos cargar los candidatos"
        description="Revisá tu conexión e intentá nuevamente."
        onRetry={() => void candidates.refetch()}
      />
    );
  }

  const { status, items, page } = candidates.data;

  if (status === "failed") {
    return (
      <RecommendationsState
        title="La generación de candidatos falló"
        description="No pudimos terminar de calcular los candidatos para este puesto. Volvé a intentarlo en un rato."
        onRetry={() => void candidates.refetch()}
      />
    );
  }

  // `none` y `completed` sin resultados son dos cosas distintas: en el primero todavía no se
  // pidió una generación para el puesto, en el segundo terminó sin coincidencias.
  if (items.length === 0 && !isGenerationInProgress(status)) {
    return status === "none" ? (
      <RecommendationsState
        title="Todavía no generamos candidatos para este puesto"
        description="Las recomendaciones se calculan de forma diferida. En cuanto estén, las vas a ver acá."
      />
    ) : (
      <RecommendationsState
        title="Todavía no hay candidatos para este puesto"
        description="No encontramos empleados que coincidan con lo que pide el puesto. Vamos a avisarte cuando aparezcan."
      />
    );
  }

  // Un `pending` o `processing` sin items todavía no tiene nada que listar: la pantalla es
  // la espera. Con items, el empleador ve el conjunto anterior mientras se regenera.
  if (items.length === 0) {
    return (
      <RecommendationsState
        title="Estamos preparando los candidatos"
        description="Calculamos los empleados que coinciden con este puesto. Esto se actualiza solo."
      />
    );
  }

  return (
    <div className="space-y-6 py-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Candidatos recomendados</h1>
        <p className="text-sm text-muted-foreground">
          {isGenerationInProgress(status)
            ? "Estamos actualizando los candidatos. Mientras tanto, estos son los últimos que encontramos."
            : "Estos son los empleados que encontramos para este puesto."}
        </p>
      </header>

      {/* El orden lo resuelve la API —puntaje descendente y actualización de perfil más
          reciente como desempate— y acá no se reordena ni se filtra. */}
      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((candidate) => (
          <li key={candidate.recommendationId}>
            <EmployeeRecommendationCard
              recommendation={candidate}
              onViewProfile={() => setSelected(candidate)}
            />
          </li>
        ))}
      </ul>

      <RecommendationsPagination
        page={{ ...page, limit: page.limit || CANDIDATES_PAGE_SIZE }}
        onOffsetChange={setOffset}
      />

      <CandidateProfileSheet
        candidate={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
};
