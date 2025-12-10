import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-[oklch(0.92_0.01_350)] animate-pulse rounded-sm", className)}
      {...props}
    />
  )
}

export { Skeleton }
