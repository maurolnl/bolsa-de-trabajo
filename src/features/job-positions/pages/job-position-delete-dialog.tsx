import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { JobPosition } from "../models/job-position";

type JobPositionDeleteDialogProps = {
  jobPosition: JobPosition | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

// El puesto seleccionado gobierna la apertura: cancelar lo limpia y nunca dispara una
// petición. Mientras la eliminación esté pendiente, cerrar queda bloqueado para no dejar
// la confirmación fuera de sincronía con una mutación en vuelo.
export const JobPositionDeleteDialog = ({
  jobPosition,
  isDeleting,
  onCancel,
  onConfirm,
}: JobPositionDeleteDialogProps) => (
  <AlertDialog
    open={jobPosition !== null}
    onOpenChange={(open) => {
      if (!open && !isDeleting) onCancel();
    }}
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          ¿Eliminar &quot;{jobPosition?.position}&quot;?
        </AlertDialogTitle>
        <AlertDialogDescription>
          El puesto deja de estar publicado y no se puede reabrir. Esta acción no
          se revierte.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? "Eliminando..." : "Eliminar puesto"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);
