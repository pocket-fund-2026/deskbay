/**
 * A map pin with a coffee bean cut out of it: the two things the site is,
 * in one mark.
 *
 * The old logo was a cup inside a hard-coded dark rounded square, which read
 * as a black box once the dark theme swapped the background under it. This
 * one carries no background of its own and paints the cutout in `--color-ink`
 * (the page ground in both themes), so it sits on light and dark without a
 * second version, and the pin silhouette stays legible down to about 16px
 * where cup handles and steam turn to mush.
 */
export default function Logo({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      role="img"
      aria-label="Bombay Cafe Map"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 30.5s10.8-11.4 10.8-17.9A10.8 10.8 0 1 0 5.2 12.6C5.2 19.1 16 30.5 16 30.5Z"
        fill="var(--color-accent)"
      />
      {/* The bean, tilted the way a bean actually sits. */}
      <ellipse
        cx="16"
        cy="12.4"
        rx="5"
        ry="6.6"
        transform="rotate(-28 16 12.4)"
        fill="var(--color-ink)"
      />
      <path
        d="M13.2 8.6c2.2 1.4 3.4 4.6 2.9 7.6"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
