const PALETTES = {
  warm: {
    sky: "linear-gradient(180deg,#4a3830 0%,#6d4c39 24%,#9a6642 46%,#4a3f39 72%,#181512 100%)",
  },
  stone: {
    sky: "linear-gradient(180deg,#2f3a42 0%,#41525c 24%,#5c7079 46%,#33393c 72%,#131412 100%)",
  },
  teal: {
    sky: "linear-gradient(180deg,#233a3c 0%,#33565a 24%,#4a7d7f 46%,#2c4344 72%,#131412 100%)",
  },
  plum: {
    sky: "linear-gradient(180deg,#3a2b3d 0%,#5a3f5f 24%,#82577f 46%,#3d2f42 72%,#151013 100%)",
  },
  moss: {
    sky: "linear-gradient(180deg,#2c3524 0%,#455334 24%,#657b47 46%,#2f3924 72%,#131412 100%)",
  },
  slate: {
    sky: "linear-gradient(180deg,#242b3a 0%,#37415a 24%,#4f5c82 46%,#2a3040 72%,#121316 100%)",
  },
  amber: {
    sky: "linear-gradient(180deg,#3d2f1c 0%,#6b4f26 24%,#a3792f 46%,#40331e 72%,#161209 100%)",
  },
};

export type SkylineVariant = keyof typeof PALETTES;

export default function Skyline({ variant }: { variant: SkylineVariant }) {
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
