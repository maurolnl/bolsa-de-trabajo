import { AxiosError } from "axios";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./features/auth/context/auth-context";

// Vive fuera del render: si se recreara en cada render, el toast de error (que actualiza
// estado) montaría un QueryClient nuevo y vacío, y las pantallas perderían la caché.
declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      // Mensaje por status HTTP para errores esperados del flujo, como credenciales
      // incorrectas. Tiene prioridad sobre el `{error}` del backend, que no está en español.
      errorMessages?: Partial<Record<number, string>>;
    };
  }
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      console.error(error);
      const response = (error as AxiosError).response;
      const responseData = response?.data as
        | { error?: string; messages?: string[] }
        | undefined;
      const statusMessage = response
        ? mutation.meta?.errorMessages?.[response.status]
        : undefined;
      let errorMsg = "Ocurrió un error, intente nuevamente";
      if (statusMessage) {
        errorMsg = statusMessage;
      } else if (responseData?.error) {
        errorMsg = responseData.error;
      } else if (responseData?.messages) {
        errorMsg = responseData.messages.join("\n");
      }
      toast({
        title: "Error",
        description: errorMsg,
      });
    },
  }),
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
