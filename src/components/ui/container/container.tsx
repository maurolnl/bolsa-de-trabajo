import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export const Container = ({
  children,
  className,
  maxWidth,
}: ContainerProps) => {
  return (
    <div
      className={cn(
        "container mx-auto",
        className,
        maxWidth && `max-w-${maxWidth}`
      )}
    >
      {children}
    </div>
  );
};
