import { type ReactNode, type ComponentType } from "react";
import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border-default bg-bg-secondary/40 px-6 py-16 text-center",
        className
      )}
    >
      {Icon && (
        <div className="rounded-full bg-bg-tertiary p-3 text-text-tertiary">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        {description && <p className="max-w-sm text-xs text-text-tertiary">{description}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
