import { Link, useNavigate } from "react-router-dom";
import { LoginForm, LoginFormType } from "../components/login-form";
import { getLogoutLocation } from "@/lib/utils";
import { useAuth } from "../hooks/useAuth";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  async function onSubmit(values: LoginFormType) {
    await login(values);
    const logoutRedirect = getLogoutLocation();
    navigate(logoutRedirect);
  }

  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
          </div>
          <LoginForm onSubmit={onSubmit} />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link to="#" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};
