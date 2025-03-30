import * as React from "react"
import { cn } from "../lib/utils"

const Button = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  ...props 
}, ref) => {
  // Base button styles
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
  
  // Variant styles
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline"
  }

  // Size styles
  const sizeStyles = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10"
  }

  // Combine styles
  const combinedClassName = cn(
    baseStyles,
    variantStyles[variant] || variantStyles.default,
    sizeStyles[size] || sizeStyles.default,
    className
  )

  return (
    <button
      ref={ref}
      className={combinedClassName}
      {...props}
    />
  )
})

Button.displayName = "Button"

export { Button }