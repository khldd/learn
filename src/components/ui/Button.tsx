import type React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl",
        secondary:
          "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 border-2 border-transparent hover:border-primary/20",
        outline: "border-2 border-primary/30 bg-transparent hover:bg-primary/5 hover:border-primary text-primary",
        ghost: "hover:bg-primary/10 hover:text-primary",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-lg",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg hover:shadow-xl",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        default: "h-10 px-4",
        lg: "h-12 px-6 text-lg font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
  return (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>
      {props.children}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
    </button>
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
