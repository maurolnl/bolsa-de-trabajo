import { cn } from "@/lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
}

export const Container = ({
  children,
  className,
  maxWidth,
}: ContainerProps) => {
  const maxWidthClass = {
    "sm": "max-w-sm",
    "md": "max-w-md",
    "lg": "max-w-lg",
    "xl": "max-w-xl",
    "2xl": "max-w-2xl",
  };
  return (
    <div
      className={cn(
        "container mx-auto",
        className,
        maxWidth && maxWidthClass[maxWidth]
      )}
    >
      {children}
    </div>
  );
};
