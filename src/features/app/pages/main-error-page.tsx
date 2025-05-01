import { Button } from "@/components/ui/button";

interface Props {
  onTryAgain?: () => Promise<void>;
}

export const MainErrorPage: React.FC<Props> = ({ onTryAgain }) => {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-full">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight">
          Oops, something went wrong
        </h3>
        <p className="text-sm text-muted-foreground">
          You can still do what you were doing.
        </p>
        <Button className="mt-4" onClick={onTryAgain}>
          Try again
        </Button>
      </div>
    </div>
  );
};
