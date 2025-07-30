import { cn } from "@/lib/utils"
import type { EnrollmentStatus } from "@/lib/types"

interface StatusChipProps {
  status: EnrollmentStatus | string
  className?: string
}

const statusStyles = {
  ACTIVE: "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-900/20",
  COMPLETED: "text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-900/20",
  DROPPED: "text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-900/20",
}

export function StatusChip({ status, className }: StatusChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-200 text-gray-800",
        statusStyles[status as keyof typeof statusStyles],
        className,
      )}
    >
      {status}
    </span>
  )
}
