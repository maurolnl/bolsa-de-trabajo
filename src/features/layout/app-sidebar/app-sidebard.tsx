import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { sidebarConfig } from "./config";
import { LogOutIcon } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { PATHS } from "@/router/paths";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const AppSidebar = () => {
  const dashboardItems = sidebarConfig.dashboard.children;
  const { isCurrent } = useSidebar();
  // const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    // navigate(PATHS.auth.login);
  };

  return (
    <Sidebar side="left" variant="floating">
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarMenu>
            {dashboardItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton isActive={isCurrent(item.to)} asChild>
                  <a href={item.to}>
                    <item.icon size={16} />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout}>
              <LogOutIcon size={16} />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
