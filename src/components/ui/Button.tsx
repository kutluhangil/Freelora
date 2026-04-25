"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-150 ease-smooth disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-text hover:bg-accent-hover shadow-glow hover:shadow-[0_0_28px_rgba(200,255,0,0.25)]",
        secondary:
          "bg-bg-tertiary text-text-primary border border-border-default hover:bg-bg-elevated hover:border-border-strong",
        ghost: "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary",
        outline:
          "border border-border-default text-text-primary hover:bg-bg-tertiary hover:border-border-strong",
        destructive:
          "bg-danger-muted text-danger border border-danger/20 hover:bg-danger hover:text-bg-primary",
        link: "text-accent hover:text-accent-hover underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
