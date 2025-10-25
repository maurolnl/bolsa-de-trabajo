import { SidebarProvider } from "@/components/ui/sidebar";
import { Container } from "@/components/ui/container/container";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-row bg-accent/40 min-h-[100vh] h-full">
      <SidebarProvider>
        <div className="flex-1 items-center justify-center">
          {/* <SidebarTrigger /> */}
          <Container maxWidth="2xl" className="h-full p-4">
            {children}
          </Container>
        </div>
      </SidebarProvider>
    </div>
  );
}
