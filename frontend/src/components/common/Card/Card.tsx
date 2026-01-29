import { type HTMLAttributes, forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "../../../utils/cn";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional title shown in a header bar */
  title?: string;
  /** Disable glassmorphism animation (e.g. for static lists) */
  noMotion?: boolean;
}

const MotionDiv = motion.div;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, children, noMotion, ...props }, ref) => {
    const content = (
      <>
        {title && (
          <div className="border-b border-[var(--color-border)] px-4 py-3">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">{title}</h2>
          </div>
        )}
        {children}
      </>
    );

    const sharedClass = cn("card overflow-hidden", className);

    if (noMotion) {
      return (
        <div ref={ref} className={sharedClass} {...props}>
          {content}
        </div>
      );
    }

    return (
      <MotionDiv
        ref={ref}
        className={sharedClass}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        {...props}
      >
        {content}
      </MotionDiv>
    );
  }
);
Card.displayName = "Card";
