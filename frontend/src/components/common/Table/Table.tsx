import { type HTMLAttributes, forwardRef } from "react";
import { cn } from "../../../utils/cn";

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Use overflow-x-auto wrapper */
  scroll?: boolean;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, scroll = true, children, ...props }, ref) => {
    const table = (
      <table
        ref={ref}
        className={cn("min-w-full divide-y divide-[var(--color-border)]", className)}
        {...props}
      >
        {children}
      </table>
    );
    if (scroll) {
      return <div className="overflow-x-auto">{table}</div>;
    }
    return table;
  }
);
Table.displayName = "Table";

export function TableHead({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("bg-[var(--color-bg)] text-left text-xs font-semibold uppercase text-[var(--color-text-muted)]", className)}
      {...props}
    />
  );
}

export function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn("divide-y divide-[var(--color-border)] bg-[var(--color-bg-card)]", className)}
      {...props}
    />
  );
}

export function TableRow({
  className,
  clickable,
  selected,
  ...props
}: HTMLAttributes<HTMLTableRowElement> & { clickable?: boolean; selected?: boolean }) {
  return (
    <tr
      className={cn(
        "divide-x-0 divide-y divide-[var(--color-border)] transition-colors",
        clickable && "cursor-pointer hover:bg-crypto-primary/10 dark:hover:bg-crypto-primary/20",
        selected && "bg-crypto-primary/10 dark:bg-crypto-primary/20",
        className
      )}
      {...props}
    />
  );
}

export function Th({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn("px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]", className)}
      {...props}
    />
  );
}

export function Td({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("whitespace-nowrap px-4 py-2.5 text-[var(--color-text)]", className)}
      {...props}
    />
  );
}
