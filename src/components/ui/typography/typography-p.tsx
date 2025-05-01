import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const pVariants = cva("", {
  variants: {
    variant: {
      medium: "text-base leading-7",
      small: "text-sm font-medium leading-none",
      large: "text-lg font-semibold leading-7",
      muted: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "medium",
  },
});
interface Props
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof pVariants> {}

export function TypographyP({ variant, className, children, ...props }: Props) {
  return (
    <p
      className={cn(pVariants({ variant: variant, className: className }))}
      {...props}
    >
      {children}
    </p>
  );
}
