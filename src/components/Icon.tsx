const paths: Record<string, React.ReactNode> = {
  code: <path d="M8 6 2 12l6 6M16 6l6 6-6 6M14 4l-4 16" />,
  smartphone: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </>
  ),
  bot: (
    <>
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <path d="M12 4v4M9 13h.01M15 13h.01M9 17h6M2 13v2M22 13v2" />
    </>
  ),
  plug: <path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0V8ZM12 18v4" />,
  cloud: <path d="M7 18a5 5 0 1 1 .9-9.9A6 6 0 0 1 19 10a4 4 0 0 1 0 8H7Z" />,
  shield: <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Zm-3 10 2 2 4-4" />,
  rocket: <path d="M5 15c-1.5 1.5-2 5-2 5s3.5-.5 5-2m-.5-5.5L13 7c3-3 6-3.5 8-3.5 0 2-.5 5-3.5 8L12 17l-5-4.5ZM9 11l-4-1 3-3h4M13 15l1 4 3-3v-4" />,
  chart: <path d="M3 3v18h18M7 15l4-4 3 3 5-6" />,
  cart: <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.8h8.2a2 2 0 0 0 2-1.6L21 8H6M10 21h.01M18 21h.01" />,
  support: <path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14a2 2 0 0 0 2 2h1v-5H6a2 2 0 0 0-2 2Zm16 0a2 2 0 0 1-2 2h-1v-5h1a2 2 0 0 1 2 2Zm-3 2v1a3 3 0 0 1-3 3h-2" />,
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
  check: <path d="m5 12 5 5 9-10" />,
  sparkles: <path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3ZM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z" />,
};

export const ICON_NAMES = Object.keys(paths).filter((n) => n !== "check");

export default function Icon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] ?? paths.code}
    </svg>
  );
}
