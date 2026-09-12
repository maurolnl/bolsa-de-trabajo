import { Card, CardContent } from "@/components/ui/card";
import { CardStackPlusIcon } from "@radix-ui/react-icons";

export const EmptyEducation = () => {
  return (
    <Card className="border-dashed bg-muted/30">
      <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-muted-foreground">
          <CardStackPlusIcon className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">
            Aún no agregaste ninguna formación
          </p>
          <p className="text-sm text-muted-foreground">
            Hacé clic en el botón "+ Agregar" para crear una nueva.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
