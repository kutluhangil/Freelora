import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium tracking-wide whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "bg-bg-tertiary text-text-secondary border border-border-subtle",
        success: "bg-success-muted text-success border border-success/20",
        warning: "bg-warning-muted text-warning border border-warning/20",
        danger: "bg-danger-muted text-danger border border-danger/20",
        info: "bg-info-muted text-info border border-info/20",
        accent: "bg-accent-muted text-accent border border-accent/30",
      },
      size: {
        sm: "px-1.5 py-0 text-[10px]",
        md: "px-2 py-0.5 text-xs",
      },
    },
    defaultVariants: { variant: "neutral", size: "md" },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
);
Badge.displayName = "Badge";
