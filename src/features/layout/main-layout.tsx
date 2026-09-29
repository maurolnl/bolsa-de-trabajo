import { useMatch } from "react-router-dom";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Container } from "@/components/ui/container/container";
import { PATHS } from "@/router/paths";

import { TopBar } from "./top-bar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  // La lista de puestos muestra las cards en dos columnas y necesita más ancho que el
  // resto de las pantallas, que son formularios de una columna.
  const isEmployerJobsList = useMatch(PATHS.main.employer.jobs) !== null;

  return (
    <div className="flex flex-row bg-accent/40 min-h-[100vh] h-full">
      <SidebarProvider>
        <div className="flex flex-1 flex-col">
          {/* <SidebarTrigger /> */}
          <TopBar />
          <Container
            maxWidth={isEmployerJobsList ? "5xl" : "2xl"}
            className="w-full flex-1 p-4"
          >
            {children}
          </Container>
        </div>
      </SidebarProvider>
    </div>
  );
}
