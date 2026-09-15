import { LoadingScreen } from "@/components/ui/loading-screen";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { saveCurrentLocation } from "@/lib/utils";
import { PATHS } from "@/router/paths";
import { Navigate } from "react-router-dom";
import { UserRole } from "@/features/auth/types";

interface Props {
  children: JSX.Element;
  noAuth?: boolean;
}
export const RequireAuth: React.FC<Props> = ({ children, noAuth }) => {
  const auth = useAuth();

  if (noAuth) {
    return children;
  }

  if (!auth.isInitialized) {
    return <LoadingScreen />;
  }

  if (!auth.isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    saveCurrentLocation();
    return <Navigate to={PATHS.auth.login} replace />;
  }

  return children;
};

export const RequireNotLogged: React.FC<Props> = ({ children }) => {
  const auth = useAuth();

  if (!auth.isInitialized) {
    return <LoadingScreen />;
  }

  if (auth.isAuthenticated) {
    return <Navigate to={PATHS.main.root} replace />;
  }

  return children;
};

type RequireRoleProps = {
  allowedRoles: readonly UserRole[];
  children: JSX.Element;
};

export const RequireRole = ({ allowedRoles, children }: RequireRoleProps) => {
  const auth = useAuth();

  if (!auth.isInitialized) {
    return <LoadingScreen />;
  }

  if (!auth.user.role || !allowedRoles.includes(auth.user.role)) {
    return <Navigate to={PATHS.main.root} replace />;
  }

  return children;
};
