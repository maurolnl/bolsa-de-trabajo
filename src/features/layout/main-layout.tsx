import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Container } from "@/components/ui/container/container";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row bg-muted/40 min-h-[100vh] h-full">
      <SidebarProvider>
        <div className="flex-1">
          <SidebarTrigger />
          <Container maxWidth="2xl" className="h-full">
            {children}
          </Container>
        </div>
      </SidebarProvider>
    </div>
  );
}
