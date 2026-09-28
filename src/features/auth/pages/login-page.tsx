import { Link, useNavigate } from "react-router-dom";
import { LoginForm, LoginFormType } from "../components/login-form";
import { getLogoutLocation } from "@/lib/utils";
import { useAuth } from "../hooks/useAuth";
import { PATHS } from "@/router/paths";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  async function onSubmit(values: LoginFormType) {
    await login(values);
    const logoutRedirect = getLogoutLocation();
    navigate(PATHS.main.root, {
      state: { requestedPath: logoutRedirect },
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <section className="w-full max-w-md rounded-xl border bg-background p-6 shadow-sm sm:p-8">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Iniciá sesión</h1>
          <p className="text-muted-foreground">
            Ingresá con tu email y contraseña.
          </p>
        </div>

        <LoginForm onSubmit={onSubmit} />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿No tenés una cuenta?{" "}
          <Link
            className="font-medium text-foreground underline"
            to={PATHS.auth.register}
          >
            Registrate
          </Link>
        </p>
      </section>
    </main>
  );
};
