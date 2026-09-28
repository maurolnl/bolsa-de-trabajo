import { LogOutIcon, UserIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/hooks/useAuth";

// Cerrar sesión solo descarta el access token local: RequireAuth detecta la sesión vacía y
// redirige al login.
export const TopBar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-14 items-center justify-end border-b bg-background px-4">
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Abrir menú de cuenta"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <UserIcon size={18} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          {user?.email && (
            <>
              <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                {user.email}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onSelect={logout}>
            <LogOutIcon size={16} className="mr-2" />
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
