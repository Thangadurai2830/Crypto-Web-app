import { type ButtonHTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../../utils/cn";

export type ButtonVariant = "primary" | "success" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  success: "btn-success",
  danger: "btn-danger",
  ghost: "btn-ghost",
};

const MotionButton = motion.button;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", disabled, type = "button", children, ...props }, ref) => (
    <MotionButton
      ref={ref}
      type={type}
      className={cn(variantClasses[variant], className)}
      disabled={disabled}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
      {...props}
    >
      {children}
    </MotionButton>
  )
);
Button.displayName = "Button";
