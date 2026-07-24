interface IconProps {
  readonly className?: string;
}

const STROKE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function BookOpenIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...STROKE}>
      <path d="M12 6c-1.8-1.8-4.4-2.4-9-2.4v14.8c4.6 0 7.2.6 9 2.4 1.8-1.8 4.4-2.4 9-2.4V3.6c-4.6 0-7.2.6-9 2.4Z" />
      <path d="M12 6v14.8" />
    </svg>
  );
}

export function HeartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...STROKE}>
      <path d="M12 20.4 4.2 12.6a4.9 4.9 0 0 1 0-6.9 4.7 4.7 0 0 1 6.7 0l1.1 1.1 1.1-1.1a4.7 4.7 0 0 1 6.7 0 4.9 4.9 0 0 1 0 6.9Z" />
    </svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...STROKE}>
      <path d="M3.5 10.5 12 3l8.5 7.5" />
      <path d="M5.5 9v11h13V9" />
      <path d="M10 20v-6h4v6" />
    </svg>
  );
}

export function ChurchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} {...STROKE}>
      <path d="M12 2v4M10 4h4" />
      <path d="M12 6l6 5v9H6v-9Z" />
      <path d="M10 20v-4a2 2 0 0 1 4 0v4" />
    </svg>
  );
}

export type RoomIconName = "BookOpen" | "Heart" | "Home" | "Church";

export const ROOM_ICONS: Record<RoomIconName, (props: IconProps) => React.ReactNode> = {
  BookOpen: BookOpenIcon,
  Heart: HeartIcon,
  Home: HomeIcon,
  Church: ChurchIcon,
};
