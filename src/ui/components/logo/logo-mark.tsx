import { contents } from "@contents";
import { cn } from "@shared/helpers/cn";

interface LogoMarkProps {
  readonly className?: string;
}

/**
 * Three wavy register rules — the open ledger that never closed,
 * reduced to a mark.
 */
export function LogoMark({ className }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 34"
      fill="none"
      aria-label={contents.logo.name}
      role="img"
      className={cn("w-11 h-auto", className)}
    >
      <path
        d="M2 6c6-5 10 5 16 0s10 5 16 0 10 5 12 2"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M2 17c6-5 10 5 16 0s10 5 16 0 10 5 12 2"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M2 28c6-5 10 5 16 0s10 5 16 0 10 5 12 2"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}
