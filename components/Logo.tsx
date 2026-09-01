export default function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#2b1810" />
      {/* cup */}
      <path d="M9 14h11l-1.3 9.3a2 2 0 0 1-2 1.7h-4.4a2 2 0 0 1-2-1.7z" fill="#f7efe0" />
      <path d="M9 14h11l-.5 3.4H9.5z" fill="#b5651d" />
      {/* handle */}
      <path d="M20 15.3c1.8.2 3 1.3 3 3s-1.4 3.1-3.4 3.1" stroke="#f7efe0" strokeWidth="1.6" fill="none" />
      {/* steam */}
      <path d="M12.5 11c-.6-1 .6-1.4 0-2.4M15.7 11c-.6-1 .6-1.4 0-2.4" stroke="#f7efe0" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
