import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useProfileExistence } from "@/features/app/hooks/use-profile-existence";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PATHS } from "@/router/paths";
import { Navigate } from "react-router-dom";

import { EmployerProfileForm } from "../forms/employer-profile/employer-profile-form";

export const EmployerProfilePage = () => {
  const { userId } = useAuth();
  const profile = useProfileExistence(userId, "employer");

  if (userId === undefined) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <p className="text-muted-foreground">No pudimos identificar tu cuenta.</p>
      </div>
    );
  }

  if (profile.isPending) {
    return <LoadingScreen />;
  }

  if (profile.isError) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <section className="max-w-md space-y-4 text-center">
          <h1 className="text-2xl font-semibold">No pudimos cargar tu perfil</h1>
          <p className="text-muted-foreground">
            Revisá tu conexión e intentá nuevamente.
          </p>
          <Button onClick={() => profile.refetch()}>Reintentar</Button>
        </section>
      </div>
    );
  }

  if (profile.data === "exists") {
    return <Navigate to={PATHS.main.employer.jobs} replace />;
  }

  return <EmployerProfileForm userId={Number(userId)} />;
};
