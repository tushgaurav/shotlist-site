import type { CSSProperties } from "react";

import { cx } from "@/lib/site";

export type ShapeKind = "circle" | "square" | "tag";
export type IconKind = "script" | "clapper" | "camera" | "reel" | "megaphone";

export const SHAPE_RATIO: Record<ShapeKind, number> = { circle: 1, square: 1, tag: 1.18 };

export const CAST = [
  { kind: "circle", icon: "script", color: "var(--color-violet)" },
  { kind: "square", icon: "clapper", color: "var(--color-green)" },
  { kind: "tag", icon: "camera", color: "var(--color-orange)" },
  { kind: "square", icon: "reel", color: "var(--color-yellow)" },
  { kind: "circle", icon: "megaphone", color: "var(--color-blue)" },
] as const satisfies ReadonlyArray<{ kind: ShapeKind; icon: IconKind; color: string }>;

const INK = "#111";
const HOLE = "var(--fill)";

function Backdrop({ kind }: { kind: ShapeKind }) {
  if (kind === "circle") return <circle cx="50" cy="50" r="50" fill={HOLE} />;
  if (kind === "square") return <rect width="100" height="100" rx="17" fill={HOLE} />;
  return (
    <path
      d="M15 0H85.5C91 0 95.6 2.9 98 7.8L116 44.2C118 48 118 52 116 55.8L98 92.2C95.6 97.1 91 100 85.5 100H15C6.7 100 0 93.3 0 85V15C0 6.7 6.7 0 15 0Z"
      fill={HOLE}
    />
  );
}

function ScriptIcon() {
  return (
    <g className="lift-part">
      <path
        d="M31 14H60L74 28V82C74 84.2 72.2 86 70 86H31C28.8 86 27 84.2 27 82V18C27 15.8 28.8 14 31 14Z"
        fill={INK}
      />
      <path
        d="M60 14V24C60 26.2 61.8 28 64 28H74"
        fill="none"
        stroke={HOLE}
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <circle cx="33.5" cy="27" r="2.6" fill={HOLE} />
      <circle cx="33.5" cy="73" r="2.6" fill={HOLE} />
      <g fill={HOLE}>
        <rect x="40" y="35" width="22" height="4.5" rx="1.5" />
        <rect x="40" y="44" width="26" height="3" rx="1.5" />
        <rect x="40" y="50" width="19" height="3" rx="1.5" />
        <rect x="49" y="59" width="11" height="3" rx="1.5" />
        <rect x="44" y="65" width="21" height="3" rx="1.5" />
        <rect x="44" y="71" width="15" height="3" rx="1.5" />
      </g>
    </g>
  );
}

const STRIPES = (y: number) =>
  [27, 43, 59, 75].map((x) => `M${x} ${y}h7l-6 9h-7z`).join("");

function ClapperIcon() {
  return (
    <g>
      <rect x="17" y="48" width="66" height="36" rx="4" fill={INK} />
      <rect x="25" y="60" width="22" height="4" rx="2" fill={HOLE} />
      <rect x="25" y="70" width="34" height="4" rx="2" fill={HOLE} />
      <rect x="17" y="37" width="66" height="9" rx="2" fill={INK} />
      <path d={STRIPES(37)} fill={HOLE} />
      <g className="clap-arm">
        <rect x="17" y="26" width="66" height="9" rx="2" fill={INK} />
        <path d={STRIPES(26)} fill={HOLE} />
      </g>
    </g>
  );
}

function Reel({ cx: x, cy: y, r }: { cx: number; cy: number; r: number }) {
  const d = r * 0.55;
  const h = r * 0.2;
  return (
    <g className="spin-part">
      <circle cx={x} cy={y} r={r} fill={INK} />
      <circle cx={x} cy={y} r={r * 0.22} fill={HOLE} />
      <circle cx={x + d} cy={y} r={h} fill={HOLE} />
      <circle cx={x - d} cy={y} r={h} fill={HOLE} />
      <circle cx={x} cy={y + d} r={h} fill={HOLE} />
      <circle cx={x} cy={y - d} r={h} fill={HOLE} />
    </g>
  );
}

function CameraIcon() {
  return (
    <g>
      <Reel cx={32} cy={34} r={12} />
      <Reel cx={57} cy={31} r={14} />
      <rect x="16" y="47" width="53" height="31" rx="4" fill={INK} />
      <path
        d="M69 55.5L84.6 47C86.1 46.2 88 47.3 88 49V76C88 77.7 86.1 78.8 84.6 78L69 69.5Z"
        fill={INK}
      />
      <circle cx="26" cy="57" r="3" fill={HOLE} />
    </g>
  );
}

const REEL_HOLES = [-90, -18, 54, 126, 198].map((deg) => {
  const a = (deg * Math.PI) / 180;
  return { x: 46 + 15.5 * Math.cos(a), y: 44 + 15.5 * Math.sin(a) };
});

function ReelIcon() {
  return (
    <g transform="translate(2 4)">
      <rect x="46" y="62" width="44" height="12" rx="1.5" fill={INK} />
      <g fill={HOLE}>
        <rect x="70" y="66" width="4" height="4" rx="0.8" />
        <rect x="78" y="66" width="4" height="4" rx="0.8" />
      </g>
      <g className="spin-part">
        <circle cx="46" cy="44" r="30" fill={INK} />
        <circle cx="46" cy="44" r="3.6" fill={HOLE} />
        {REEL_HOLES.map((h) => (
          <circle key={`${h.x}-${h.y}`} cx={h.x} cy={h.y} r="6.8" fill={HOLE} />
        ))}
      </g>
    </g>
  );
}

function MegaphoneIcon() {
  return (
    <g transform="translate(-5 -1)">
      <g className="mega-body">
        <rect x="20" y="41" width="14" height="20" rx="3" fill={INK} />
        <path
          d="M33 41L65 25.5C67.7 24.2 71 26.1 71 29.1V72.9C71 75.9 67.7 77.8 65 76.5L33 61Z"
          fill={INK}
        />
        <rect x="38" y="58" width="9" height="18" rx="3" fill={INK} />
      </g>
      <g className="mega-waves" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none">
        <path d="M79 40C82 46.5 82 55.5 79 62" />
        <path d="M87 33C92.5 43 92.5 59 87 69" />
      </g>
    </g>
  );
}

const ICONS: Record<IconKind, () => React.JSX.Element> = {
  script: ScriptIcon,
  clapper: ClapperIcon,
  camera: CameraIcon,
  reel: ReelIcon,
  megaphone: MegaphoneIcon,
};

export function Shape({
  kind,
  icon,
  color,
  className,
  style,
}: {
  kind: ShapeKind;
  icon?: IconKind;
  color: string;
  className?: string;
  style?: CSSProperties;
}) {
  const Icon = icon ? ICONS[icon] : null;
  return (
    <svg
      aria-hidden
      viewBox={kind === "tag" ? "0 0 118 100" : "0 0 100 100"}
      className={cx("shape block h-full w-full overflow-visible", className)}
      style={{ "--fill": color, ...style } as CSSProperties}
    >
      <Backdrop kind={kind} />
      {Icon && (
        <g transform={kind === "tag" ? "translate(5 0)" : undefined}>
          <Icon />
        </g>
      )}
    </svg>
  );
}

/** A plain filled glyph used as punctuation in marquees and labels. */
export function Glyph({ kind, className }: { kind: ShapeKind; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox={kind === "tag" ? "0 0 118 100" : "0 0 100 100"}
      className={cx("inline-block h-[0.72em] w-auto shrink-0", className)}
      style={{ "--fill": "currentColor" } as CSSProperties}
    >
      <Backdrop kind={kind} />
    </svg>
  );
}
