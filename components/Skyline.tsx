const PALETTES = {
  warm: {
    sky: "linear-gradient(180deg,#4a3830 0%,#6d4c39 24%,#9a6642 46%,#4a3f39 72%,#181512 100%)",
  },
  stone: {
    sky: "linear-gradient(180deg,#2f3a42 0%,#41525c 24%,#5c7079 46%,#33393c 72%,#131412 100%)",
  },
};

export default function Skyline({ variant }: { variant: "warm" | "stone" }) {
  const bars = [80, 268, 452, 700, 892];
  return (
    <div aria-hidden className="absolute inset-0">
      <div className="absolute inset-0" style={{ background: PALETTES[variant].sky }} />
      <svg
        viewBox="0 0 1200 420"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 bottom-0 h-[72%] w-full"
      >
        <path
          fill="rgba(10,9,8,0.88)"
          d="M0 420V330l64-40 64 40v-22l72-42 72 42v-16l68-40 68 40v-30l70-42 70 42v26l66-38 66 38v-20l74-42 74 42v22l70-40 70 40v90z"
        />
        {bars.map((x) => (
          <g key={x} fill="rgba(255,236,206,0.28)">
            <rect x={x} y={352} width={16} height={22} rx={2} />
            <rect x={x + 30} y={352} width={16} height={22} rx={2} />
          </g>
        ))}
      </svg>
    </div>
  );
}
