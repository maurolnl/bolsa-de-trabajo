import { cn } from "@/lib/utils";
import { TypographyP } from "./typography/typography-p";

export interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({
  size = 24,
  className,
  ...props
}: ISVGProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("animate-spin", className)}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
};

export const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen gap-2">
      <LoadingSpinner className="text-muted-foreground" />
      <TypographyP className="text-muted-foreground">Loading...</TypographyP>
    </div>
  );
};
