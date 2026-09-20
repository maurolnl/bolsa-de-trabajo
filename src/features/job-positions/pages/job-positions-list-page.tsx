import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PATHS } from "@/router/paths";

import {
  isUnavailableJobPositionError,
  jobPositionKeys,
  useDeleteJobPosition,
  useEmployerJobPositions,
} from "../hooks/use-job-positions";
import { useEmployerContext } from "../hooks/use-employer-context";
import { JobPosition } from "../models/job-position";
import { JobPositionCard } from "./job-position-card";
import { JobPositionDeleteDialog } from "./job-position-delete-dialog";
import { JobPositionState } from "./job-position-state";

export const JobPositionsListPage = () => {
  const { userId } = useAuth();
  const employer = useEmployerContext(Number(userId));

  if (userId === undefined) {
    return (
      <JobPositionState
        title="No pudimos identificar tu cuenta"
        description="Volvé a iniciar sesión para ver tus puestos."
      />
    );
  }

  if (employer.isPending) {
    return <LoadingScreen />;
  }

  if (employer.isError) {
    return (
      <JobPositionState
        title="No pudimos cargar tus puestos"
        description="Revisá tu conexión e intentá nuevamente."
        onRetry={employer.refetch}
      />
    );
  }

  if (employer.employerId === undefined) {
    return <Navigate to={PATHS.main.employer.profile} replace />;
  }

  return <JobPositionsList employerId={employer.employerId} />;
};

// El identificador del empleador sale del perfil propio y nunca de la URL, así que la
// colección solo se pide una vez resuelto.
const JobPositionsList = ({ employerId }: { employerId: number }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const jobPositions = useEmployerJobPositions(employerId);
  const deleteJobPosition = useDeleteJobPosition(employerId);
  const [pendingDeletion, setPendingDeletion] = useState<JobPosition | null>(
    null,
  );

  if (jobPositions.isPending) {
    return <LoadingScreen />;
  }

  if (jobPositions.isError) {
    return (
      <JobPositionState
        title="No pudimos cargar tus puestos"
        description="Revisá tu conexión e intentá nuevamente."
        onRetry={() => void jobPositions.refetch()}
      />
    );
  }

  const handleConfirmDeletion = async () => {
    if (!pendingDeletion) return;

    try {
      await deleteJobPosition.mutateAsync(pendingDeletion.id);
      toast({
        title: "Puesto eliminado",
        description: `"${pendingDeletion.position}" ya no está publicado.`,
      });
    } catch (error) {
      // El puesto ya no existe o dejó de pertenecer al empleador: el listado local estaba
      // viejo y se refresca contra la API en lugar de ofrecer un reintento inútil.
      if (isUnavailableJobPositionError(error)) {
        await queryClient.invalidateQueries({
          queryKey: jobPositionKeys.byEmployer(employerId),
        });
      }
      // El MutationCache global presenta el error recibido de la API.
    } finally {
      setPendingDeletion(null);
    }
  };

  if (jobPositions.data.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <section className="max-w-md space-y-4 text-center">
          <h1 className="text-2xl font-semibold">Todavía no publicaste puestos</h1>
          <p className="text-muted-foreground">
            Publicá tu primer puesto para empezar a recibir candidatos
            recomendados.
          </p>
          <Button onClick={() => navigate(PATHS.main.employer.jobsNew)}>
            Publicar puesto
          </Button>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Mis puestos de trabajo</h1>
          <p className="text-sm text-muted-foreground">
            Estos son los puestos que tenés publicados.
          </p>
        </div>
        <Button onClick={() => navigate(PATHS.main.employer.jobsNew)}>
          Publicar puesto
        </Button>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {jobPositions.data.map((jobPosition) => (
          <JobPositionCard
            key={jobPosition.id}
            jobPosition={jobPosition}
            isDeleting={
              deleteJobPosition.isPending &&
              pendingDeletion?.id === jobPosition.id
            }
            onEdit={() =>
              navigate(PATHS.main.employer.jobsEdit(jobPosition.id))
            }
            onDelete={() => setPendingDeletion(jobPosition)}
            onViewCandidates={() =>
              navigate(PATHS.main.employer.jobsCandidates(jobPosition.id))
            }
          />
        ))}
      </div>

      <JobPositionDeleteDialog
        jobPosition={pendingDeletion}
        isDeleting={deleteJobPosition.isPending}
        onCancel={() => setPendingDeletion(null)}
        onConfirm={() => void handleConfirmDeletion()}
      />
    </div>
  );
};
