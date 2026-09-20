import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { LoadingScreen } from "@/components/ui/loading-screen";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Timezone } from "@/features/employees/repo/types";
import { PATHS } from "@/router/paths";

import { JobPositionForm } from "../forms/job-position/job-position-form";
import { emptyJobPositionValues } from "../forms/job-position/initial-values";
import { JobPositionFormValues } from "../forms/job-position/schema";
import { useCreateJobPosition } from "../hooks/use-job-positions";
import { useEmployerContext } from "../hooks/use-employer-context";
import { JobPosition } from "../models/job-position";
import { JobPositionPublished } from "./job-position-published";
import { JobPositionState } from "./job-position-state";

export const JobPositionCreatePage = () => {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const employer = useEmployerContext(Number(userId));
  const [published, setPublished] = useState<JobPosition | null>(null);

  if (userId === undefined) {
    return (
      <JobPositionState
        title="No pudimos identificar tu cuenta"
        description="Volvé a iniciar sesión para publicar un puesto."
      />
    );
  }

  if (employer.isPending) {
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

  if (employer.employerId === undefined) {
    return <Navigate to={PATHS.main.employer.profile} replace />;
  }

  if (published) {
    return (
      <JobPositionPublished
        jobPosition={published}
        onCreateAnother={() => setPublished(null)}
        onGoToJobs={() => navigate(PATHS.main.employer.jobs, { replace: true })}
      />
    );
  }

  return (
    <JobPositionCreateForm
      employerId={employer.employerId}
      timezones={employer.timezones}
      onPublished={setPublished}
      onCancel={() => navigate(PATHS.main.employer.jobs)}
    />
  );
};

type JobPositionCreateFormProps = {
  employerId: number;
  timezones: Timezone[];
  onPublished: (jobPosition: JobPosition) => void;
  onCancel: () => void;
};

// El hook de creación depende del identificador del empleador, así que solo se monta
// cuando ese identificador ya está resuelto.
const JobPositionCreateForm = ({
  employerId,
  timezones,
  onPublished,
  onCancel,
}: JobPositionCreateFormProps) => {
  const createJobPosition = useCreateJobPosition(employerId);

  const handleSubmit = async (values: JobPositionFormValues) => {
    try {
      onPublished(await createJobPosition.mutateAsync(values));
    } catch {
      // El MutationCache global presenta el error y el formulario conserva sus datos.
    }
  };

  return (
    <JobPositionForm
      title="Publicá un puesto de trabajo"
      description="El puesto queda publicado apenas lo creás."
      submitLabel="Publicar puesto"
      timezones={timezones}
      defaultValues={emptyJobPositionValues}
      isSubmitting={createJobPosition.isPending}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    />
  );
};
