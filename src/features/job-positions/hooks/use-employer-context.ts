import { useTimezones } from "@/features/employees/hooks/useEmployee";
import { useEmployerProfile } from "@/features/employers/hooks/use-employer";

// El alta y la edición necesitan lo mismo antes de mostrar el formulario: el empleador
// derivado del perfil propio y el catálogo remoto de zonas horarias. Un `employerId`
// indefinido con la consulta ya resuelta significa que la cuenta todavía no tiene perfil.
export const useEmployerContext = (userId: number) => {
  const profile = useEmployerProfile(userId);
  const timezones = useTimezones();

  return {
    employerId: profile.data?.id,
    timezones: timezones.data ?? [],
    isPending: profile.isPending || timezones.isPending,
    isError: profile.isError || timezones.isError,
    refetch: () => {
      void profile.refetch();
      void timezones.refetch();
    },
  };
};
