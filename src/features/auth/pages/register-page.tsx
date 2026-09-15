import { Link, useNavigate } from "react-router-dom";

import { PATHS } from "@/router/paths";

import { RegisterForm, RegisterFormType } from "../components/register-form";
import { useRegisterMutation } from "../hooks/useAuth";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();

  const onSubmit = async (values: RegisterFormType) => {
    await registerMutation.mutateAsync(values);
    navigate(PATHS.auth.login, { replace: true });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <section className="w-full max-w-xl rounded-xl border bg-background p-6 shadow-sm sm:p-8">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Creá tu cuenta</h1>
          <p className="text-muted-foreground">
            Elegí tu rol para comenzar con el perfil correcto.
          </p>
        </div>

        <RegisterForm
          isSubmitting={registerMutation.isPending}
          onSubmit={onSubmit}
        />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tenés una cuenta?{" "}
          <Link className="font-medium text-foreground underline" to={PATHS.auth.login}>
            Iniciá sesión
          </Link>
        </p>
      </section>
    </main>
  );
};
