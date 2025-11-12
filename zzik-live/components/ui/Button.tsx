import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "secondary" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? "span" : "button";
    
    return (
      <Comp
        className={cn(
          // Base styles
          "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          "disabled:pointer-events-none disabled:opacity-50",
          
          // Variants
          {
            "bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 hover:shadow-xl hover:scale-105 focus-visible:outline-primary": 
              variant === "primary",
            "bg-secondary text-secondary-foreground shadow-lg hover:bg-secondary/90 hover:shadow-xl hover:scale-105 focus-visible:outline-secondary": 
              variant === "secondary",
            "bg-transparent border-2 border-border text-foreground hover:bg-muted hover:scale-105": 
              variant === "ghost",
            "bg-background border-2 border-border text-foreground shadow-sm hover:bg-muted hover:shadow-md": 
              variant === "outline",
            "bg-foreground text-background shadow-lg hover:bg-foreground/90 hover:shadow-xl hover:scale-105": 
              variant === "default",
          },
          
          // Sizes
          {
            "px-6 py-3 text-sm": size === "default",
            "px-4 py-2 text-xs": size === "sm",
            "px-8 py-4 text-base": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
