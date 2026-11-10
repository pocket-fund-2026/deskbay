// Brand guide §2.2: outline icons, 24px grid, 2px stroke, round caps/joins,
// never filled, Ink/Oat only (currentColor). wifi/power/seating/longStay/calls
// are the guide's own; focus/food/outdoor/bathroom are drawn to the same spec.
const PATHS: Record<string, React.ReactNode> = {
  wifi: <><path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0" /><circle cx="12" cy="19.5" r=".8" /></>,
  power: <><rect x="4" y="3" width="16" height="18" rx="4" /><circle cx="9.5" cy="9" r="1" /><circle cx="14.5" cy="9" r="1" /><circle cx="12" cy="14.5" r="1.5" /></>,
  seating: <path d="M7 3v10M7 13h11M18 13v8M7 13v8M7 8h5" />,
  longStay: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  calls: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
  focus: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r=".8" /></>,
  food: <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8ZM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3v2M12 3v2" />,
  outdoor: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" /></>,
  bathroom: <path d="M12 3s6 6.2 6 10.5a6 6 0 0 1-12 0C6 9.2 12 3 12 3Z" />,
};

export default function FactorIcon({ name, size = 20 }: { name: string; size?: number }) {
  const body = PATHS[name];
  if (!body) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {body}
    </svg>
  );
}
