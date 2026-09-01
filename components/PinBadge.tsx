export default function PinBadge({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.27} viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15 37C15 37 28 22.8 28 14C28 6.8 22.2 1 15 1C7.8 1 2 6.8 2 14C2 22.8 15 37 15 37Z"
        fill={color}
        stroke="#f6f1e9"
        strokeWidth="2"
      />
      <circle cx="15" cy="14" r="6.5" fill="#f6f1e9" />
      <path d="M12 12.3h4.6M12 14.3h4.6M12.6 16h3.4" stroke={color} strokeWidth="1.15" strokeLinecap="round" />
    </svg>
  );
}
