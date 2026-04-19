import * as React from "react"
import { cn } from "../../lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

const badgeVariants: Record<string, string> = {
  default: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-transparent",
  secondary: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-transparent",
  destructive: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300 border-transparent",
  success: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-transparent",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-transparent",
  outline: "text-gray-foreground border-gray-300 dark:border-gray-700",
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-tight transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  )
}
