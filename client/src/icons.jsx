// Small stroke-based inline icons shared across components. Kept as plain
// functions (not a component library) since the icon set is short and
// purpose-built for this app — never emoji/dingbats, per the approved sketch.

export function CamelMark({ size = 19, color = "currentColor" }) {
  return (
    <svg width={size} height={(size * 15) / 19} viewBox="0 0 120 70" fill="none" stroke={color} strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M25 55 C22 40 30 30 42 32 C46 20 58 16 64 26 C70 18 82 20 84 30 C96 30 100 42 92 52 C88 56 30 58 25 55 Z" />
      <path d="M92 34 C100 28 106 18 104 10 C112 12 114 20 108 26" />
      <ellipse cx="106" cy="14" rx="7" ry="5" />
      <line x1="30" y1="55" x2="28" y2="68" />
      <line x1="40" y1="55" x2="40" y2="68" />
      <line x1="70" y1="55" x2="68" y2="68" />
      <line x1="82" y1="55" x2="84" y2="68" />
    </svg>
  );
}

export function CamelThumb({ size = 34, color = "var(--color-text-faint)" }) {
  return (
    <svg width={size} height={(size * 22) / 38} viewBox="0 0 120 70" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M25 55 C22 40 30 30 42 32 C46 20 58 16 64 26 C70 18 82 20 84 30 C96 30 100 42 92 52 C88 56 30 58 25 55 Z" />
      <path d="M92 34 C100 28 106 18 104 10 C112 12 114 20 108 26" />
      <ellipse cx="106" cy="14" rx="7" ry="5" />
      <line x1="30" y1="55" x2="28" y2="68" />
      <line x1="40" y1="55" x2="40" y2="68" />
      <line x1="70" y1="55" x2="68" y2="68" />
      <line x1="82" y1="55" x2="84" y2="68" />
    </svg>
  );
}

export function CheckIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusIcon({ size = 20, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

export function ReplaceIcon({ size = 12, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20 11A8 8 0 1 0 18.5 16" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M20 5v6h-6" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronDown({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M15 6l-6 6 6 6" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronUp({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 15l6-6 6 6" stroke={color} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InfoIcon({ size = 15, color = "var(--color-text-faint)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <line x1="12" y1="11" x2="12" y2="16" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1" fill={color} />
    </svg>
  );
}

export function AlertIcon({ size = 14, color = "#fff" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="7" x2="12" y2="14" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="12" cy="18" r="1.3" fill={color} />
    </svg>
  );
}

export function TrophyIcon({ size = 18, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M8 21h8M12 17v4M6 4h12v3a6 6 0 0 1-12 0V4Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 6H4a2 2 0 0 0 2 4M18 6h2a2 2 0 0 1-2 4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
