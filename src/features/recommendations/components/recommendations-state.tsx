import { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type RecommendationsStateProps = {
  title: string;
  description: string;
  onRetry?: () => void;
  action?: ReactNode;
};

// Mismo patrón que `JobPositionState` del lado del empleador. `onRetry` se omite en los
// casos que no se resuelven reintentando —un 403, o un conjunto vacío— para no ofrecer una
// acción que no cambia nada.
export const RecommendationsState = ({
  title,
  description,
  onRetry,
  action,
}: RecommendationsStateProps) => (
  <div className="flex min-h-[60vh] items-center justify-center px-4">
    <section className="max-w-md space-y-4 text-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      {onRetry ? <Button onClick={onRetry}>Reintentar</Button> : null}
      {action}
    </section>
  </div>
);
