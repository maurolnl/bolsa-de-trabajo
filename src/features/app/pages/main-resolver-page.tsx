import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PATHS } from "@/router/paths";
import { Navigate, useLocation } from "react-router-dom";

import { useProfileExistence } from "../hooks/use-profile-existence";

export const MainResolverPage = () => {
  const { user, userId } = useAuth();
  const location = useLocation();
  const profile = useProfileExistence(userId, user.role);

  if (!user.role || userId === undefined) {
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

  const destination =
    user.role === "employee"
      ? profile.data === "missing"
        ? PATHS.main.employee.profile
        : PATHS.main.employee.home
      : profile.data === "missing"
        ? PATHS.main.employer.profile
        : PATHS.main.employer.jobs;
  const requestedPath = (location.state as { requestedPath?: unknown } | null)
    ?.requestedPath;
  const validatedDestination =
    typeof requestedPath === "string" && requestedPath === destination
      ? requestedPath
      : destination;

  return <Navigate to={validatedDestination} replace />;
};
