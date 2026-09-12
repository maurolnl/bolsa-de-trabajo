import { AxiosError } from "axios";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "./features/auth/context/auth-context";

function App() {
  const { toast } = useToast();

  const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false, retry: false } },
    mutationCache: new MutationCache({
      onError: (error) => {
        console.error(error);
        const responseData = (error as AxiosError).response?.data as
          | { error?: string; messages?: string[] }
          | undefined;
        let errorMsg = "Ocurrió un error, intente nuevamente";
        if (responseData?.error) {
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
