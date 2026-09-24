import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useEmployeeProfile } from "@/features/employees/hooks/useEmployee";
import { PATHS } from "@/router/paths";

import {
  RECOMMENDATIONS_PAGE_SIZE,
  isForbiddenRecommendationsError,
  useJobRecommendations,
} from "../hooks/use-job-recommendations";
import {
  JobRecommendation,
  isGenerationInProgress,
} from "../models/job-recommendation";
import { JobRecommendationCard } from "./job-recommendation-card";
import { JobRecommendationDetailSheet } from "./job-recommendation-detail-sheet";
import { RecommendationsPagination } from "./recommendations-pagination";
import { RecommendationsState } from "./recommendations-state";

// La ruta está reservada a una sesión `employee` con perfil propio: sin perfil no hay
// sujeto del que pedir recomendaciones, así que se redirige al onboarding antes de
// consultar nada.
export const JobRecommendationsPage = () => {
  const { userId } = useAuth();
  const profile = useEmployeeProfile(Number(userId));

  if (userId === undefined) {
    return (
      <RecommendationsState
        title="No pudimos identificar tu cuenta"
        description="Volvé a iniciar sesión para ver tus recomendaciones."
      />
    );
  }

  // Mientras el perfil no resuelva no se redirige ni se consulta: una redirección
  // provisional mandaría al onboarding a alguien que sí tiene perfil.
  if (profile.isPending) {
    return <LoadingScreen />;
  }

  if (profile.isError) {
    return (
      <RecommendationsState
        title="No pudimos cargar tu perfil"
        description="Revisá tu conexión e intentá nuevamente."
        onRetry={() => void profile.refetch()}
      />
    );
  }

  // Perfil resuelto y nulo significa que la cuenta todavía no lo creó: sin sujeto no hay
  // recomendaciones que pedir.
  if (!profile.data) {
    return <Navigate to={PATHS.main.employee.profile} replace />;
  }

  return <JobRecommendationsList employeeId={profile.data.id} />;
};

// El identificador del perfil de empleado sale de la consulta del perfil propio y nunca de
// la navegación: el backend lo usa solo para detectar un acceso ajeno y responde 403 con un
// mensaje genérico ante cualquier otro.
const JobRecommendationsList = ({ employeeId }: { employeeId: number }) => {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<JobRecommendation | null>(null);
  const recommendations = useJobRecommendations(employeeId, offset);

  const total = recommendations.data?.page.total;

  // El conjunto puede achicarse entre dos generaciones y dejar el tramo actual fuera de
  // rango. Volver al comienzo evita quedarse mirando una página vacía que no es el
  // resultado real.
  useEffect(() => {
    if (total !== undefined && offset > 0 && offset >= total) {
      setOffset(0);
    }
  }, [total, offset]);

  if (recommendations.isPending) {
    return <LoadingScreen />;
  }

  if (recommendations.isError) {
    // Un 403 significa rol incorrecto o perfil ajeno: la API ya lo rechazó por
    // autorización y reintentar no lo cambia.
    if (isForbiddenRecommendationsError(recommendations.error)) {
      return (
        <RecommendationsState
          title="No pudimos mostrarte estas recomendaciones"
          description="Esta sección está disponible solo para tu propio perfil de empleado."
        />
      );
    }

    return (
      <RecommendationsState
        title="No pudimos cargar tus recomendaciones"
        description="Revisá tu conexión e intentá nuevamente."
        onRetry={() => void recommendations.refetch()}
      />
    );
  }

  const { status, items, page } = recommendations.data;

  if (status === "failed") {
    return (
      <RecommendationsState
        title="La generación de tus recomendaciones falló"
        description="No pudimos terminar de calcular tus puestos recomendados. Volvé a intentarlo en un rato."
        onRetry={() => void recommendations.refetch()}
      />
    );
  }

  // `none` y `completed` sin resultados son dos cosas distintas y la acción que le
  // corresponde al empleado también: en el primero todavía no se pidió una generación, en
  // el segundo terminó sin coincidencias.
  if (items.length === 0 && !isGenerationInProgress(status)) {
    return status === "none" ? (
      <RecommendationsState
        title="Todavía no generamos tus recomendaciones"
        description="Completá o actualizá tu perfil para que podamos buscar puestos que coincidan con vos."
        action={
          <Button onClick={() => navigate(PATHS.main.employee.profile)}>
            Ir a mi perfil
          </Button>
        }
      />
    ) : (
      <RecommendationsState
        title="Todavía no hay puestos para vos"
        description="No encontramos puestos publicados que coincidan con tu perfil. Vamos a avisarte cuando aparezcan."
      />
    );
  }

  // Un `pending` o `processing` sin items todavía no tiene nada que listar: la pantalla es
  // la espera. Con items, el empleado ve el conjunto anterior mientras se regenera.
  if (items.length === 0) {
    return (
      <RecommendationsState
        title="Estamos preparando tus recomendaciones"
        description="Calculamos los puestos que coinciden con tu perfil. Esto se actualiza solo."
      />
    );
  }

  return (
    <div className="space-y-6 py-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Puestos recomendados</h1>
        <p className="text-sm text-muted-foreground">
          {isGenerationInProgress(status)
            ? "Estamos actualizando tus recomendaciones. Mientras tanto, estos son los últimos puestos que encontramos."
            : "Estos son los puestos que encontramos para tu perfil."}
        </p>
      </header>

      {/* El orden lo resuelve la API —puntaje descendente, publicación más reciente como
          desempate y puestos sin puntaje al final— y acá no se reordena ni se filtra. */}
      <ul className="grid gap-4 md:grid-cols-2">
        {items.map((recommendation) => (
          <li key={recommendation.recommendationId}>
            <JobRecommendationCard
              recommendation={recommendation}
              onViewDetail={() => setSelected(recommendation)}
            />
          </li>
        ))}
      </ul>

      <RecommendationsPagination
        page={{ ...page, limit: page.limit || RECOMMENDATIONS_PAGE_SIZE }}
        onOffsetChange={setOffset}
      />

      <JobRecommendationDetailSheet
        recommendation={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
};
