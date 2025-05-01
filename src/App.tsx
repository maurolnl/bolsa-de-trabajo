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
        const { messages } = (error as AxiosError).response?.data as {
          messages: string[];
        };
        let errorMsg = "Something went wrong";
        if (messages) {
          errorMsg = messages.join("\n");
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
