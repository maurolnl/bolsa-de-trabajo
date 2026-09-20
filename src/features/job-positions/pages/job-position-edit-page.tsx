import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import { LoadingScreen } from "@/components/ui/loading-screen";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Timezone } from "@/features/employees/repo/types";
import { PATHS } from "@/router/paths";

import { JobPositionForm } from "../forms/job-position/job-position-form";
import { jobPositionToFormValues } from "../forms/job-position/initial-values";
import { JobPositionFormValues } from "../forms/job-position/schema";
import { useEmployerContext } from "../hooks/use-employer-context";
import {
  useJobPosition,
  useUpdateJobPosition,
} from "../hooks/use-job-positions";
import { JobPosition } from "../models/job-position";
import { JobPositionState } from "./job-position-state";

// El backend responde 404 para un puesto inexistente o eliminado y 403 para uno ajeno. Ni
// uno ni otro se resuelven reintentando.
const unavailableJobPositionMessage = (error: unknown) => {
  if (!axios.isAxiosError(error)) return null;

  if (error.response?.status === 404) {
    return "El puesto no existe o fue eliminado.";
  }
  if (error.response?.status === 403) {
    return "No tenés permiso para editar este puesto.";
  }

  return null;
};

export const JobPositionEditPage = () => {
  const navigate = useNavigate();
  const { jobPositionId } = useParams();
  const { userId } = useAuth();
  const employer = useEmployerContext(Number(userId));
  const jobPosition = useJobPosition(Number(jobPositionId));

  if (userId === undefined) {
    return (
      <JobPositionState
        title="No pudimos identificar tu cuenta"
        description="Volvé a iniciar sesión para editar un puesto."
      />
    );
  }

  if (employer.isPending || jobPosition.isPending) {
    return <LoadingScreen />;
  }

  if (employer.isError) {
    return (
      <JobPositionState
        title="No pudimos preparar el formulario"
        description="Revisá tu conexión e intentá nuevamente."
        onRetry={employer.refetch}
      />
    );
  }

  if (jobPosition.isError) {
    const unavailable = unavailableJobPositionMessage(jobPosition.error);

    return (
      <JobPositionState
        title={
          unavailable ? "No podés editar este puesto" : "No pudimos cargar el puesto"
        }
        description={unavailable ?? "Revisá tu conexión e intentá nuevamente."}
        onRetry={unavailable ? undefined : () => void jobPosition.refetch()}
      />
    );
  }

  if (employer.employerId === undefined) {
    return <Navigate to={PATHS.main.employer.profile} replace />;
  }

  return (
    <JobPositionEditForm
      employerId={employer.employerId}
      jobPosition={jobPosition.data}
      timezones={employer.timezones}
      onFinished={() => navigate(PATHS.main.employer.jobs, { replace: true })}
    />
  );
};

type JobPositionEditFormProps = {
  employerId: number;
  jobPosition: JobPosition;
  timezones: Timezone[];
  onFinished: () => void;
};

const JobPositionEditForm = ({
  employerId,
  jobPosition,
  timezones,
  onFinished,
}: JobPositionEditFormProps) => {
  const updateJobPosition = useUpdateJobPosition(jobPosition.id, employerId);

  // La API reemplaza el puesto entero: el formulario envía siempre el conjunto completo.
  const handleSubmit = async (values: JobPositionFormValues) => {
    try {
      await updateJobPosition.mutateAsync(values);
      onFinished();
    } catch {
      // El MutationCache global presenta el error y el formulario conserva sus datos.
    }
  };

  return (
    <JobPositionForm
      title="Editá el puesto de trabajo"
      description="Los cambios reemplazan los datos publicados del puesto."
      submitLabel="Guardar cambios"
      timezones={timezones}
      defaultValues={jobPositionToFormValues(jobPosition)}
      isSubmitting={updateJobPosition.isPending}
      onSubmit={handleSubmit}
      onCancel={onFinished}
    />
  );
};
