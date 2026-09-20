import { Button } from "@/components/ui/button";

type JobPositionStateProps = {
  title: string;
  description: string;
  onRetry?: () => void;
};

export const JobPositionState = ({
  title,
  description,
  onRetry,
}: JobPositionStateProps) => (
  <div className="flex min-h-[60vh] items-center justify-center px-4">
    <section className="max-w-md space-y-4 text-center">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
      {onRetry ? <Button onClick={onRetry}>Reintentar</Button> : null}
    </section>
  </div>
);
