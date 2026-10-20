import { authorInitials, type ArticlePreview, type AvatarColor, type Cover } from "@/lib/articles";
import { cx } from "@/lib/site";

const AVATAR: Record<AvatarColor, string> = {
  orange: "bg-orange text-ink",
  yellow: "bg-yellow text-ink",
  lime: "bg-lime text-ink",
  green: "bg-green text-paper",
  violet: "bg-violet text-ink",
  blue: "bg-blue text-ink",
};

export function coverRing(ground: Cover["ground"]) {
  return ground === "paper" ? "ring-ink/12" : "ring-paper/12";
}

export function AuthorMark({
  name,
  color,
  size = "size-6",
  text = "text-[10px]",
}: {
  name: string;
  color: AvatarColor;
  size?: string;
  text?: string;
}) {
  return (
    <span
      aria-hidden
      className={cx(
        "grid shrink-0 place-items-center rounded-full font-bold tracking-wide",
        size,
        text,
        AVATAR[color],
      )}
    >
      {authorInitials(name)}
    </span>
  );
}

export function ArticleCover({ cover, className }: { cover: ArticlePreview["cover"]; className?: string }) {
  const light = cover.ground === "paper";

  return (
    <div className={cx("@container relative aspect-[16/10] overflow-hidden", light ? "bg-paper" : "bg-ink-3", className)}>
      {cover.kind === "slate" ? <Slate cover={cover} /> : null}
      {cover.kind === "clapper" ? <Clapper cover={cover} /> : null}
      {cover.kind === "finder" ? <Finder cover={cover} /> : null}
      {cover.kind === "script" ? <ScriptPage cover={cover} /> : null}
    </div>
  );
}

function Note({ children, light, className }: { children: string; light: boolean; className?: string }) {
  return (
    <p
      className={cx(
        "font-script text-[clamp(10px,2.15cqw,13px)] tracking-[0.16em] uppercase",
        light ? "text-ink/50" : "text-paper/50",
        className,
      )}
    >
      {children}
    </p>
  );
}

function Mark({ children, light, className }: { children: string; light: boolean; className?: string }) {
  return (
    <p
      className={cx(
        "type-display leading-[0.8] tracking-[-0.06em]",
        light ? "text-ink" : "text-paper",
        className,
      )}
    >
      {children}
    </p>
  );
}

function Slate({ cover }: { cover: Extract<Cover, { kind: "slate" }> }) {
  const light = cover.ground === "paper";
  return (
    <>
      <div
        aria-hidden
        className={cx(
          "absolute -bottom-[28%] -left-[16%] aspect-square w-[62%]",
          cover.shape === "circle" ? "rounded-full" : "rounded-[18%]",
        )}
        style={{ background: cover.accent }}
      />
      <Note light={light} className="absolute top-[8%] left-[6%]">
        {cover.note}
      </Note>
      <Mark
        light={light}
        className="absolute right-[5%] bottom-[7%] left-[48%] text-right text-[clamp(3.25rem,17cqw,8rem)]"
      >
        {cover.mark}
      </Mark>
    </>
  );
}

function Stripes() {
  return (
    <div
      aria-hidden
      className="absolute inset-0"
      style={{
        backgroundImage:
          "repeating-linear-gradient(-58deg, transparent 0 8px, rgb(18 18 18 / 0.88) 8px 16px)",
      }}
    />
  );
}

function Clapper({ cover }: { cover: Extract<Cover, { kind: "clapper" }> }) {
  const light = cover.ground === "paper";
  return (
    <>
      <div className="absolute inset-x-[7%] top-[9%] h-[15%] overflow-hidden rounded-[4px]" style={{ background: cover.accent }}>
        <Stripes />
      </div>
      <div className="absolute inset-x-[7%] top-[27%] h-[15%] overflow-hidden rounded-[4px]" style={{ background: cover.accent }}>
        <Stripes />
      </div>
      <div className="absolute inset-x-[7%] bottom-[8%] flex items-end justify-between gap-3">
        <Note light={light} className="max-w-[48%]">
          {cover.note}
        </Note>
        <Mark light={light} className="shrink-0 text-[clamp(2.5rem,13cqw,6.5rem)]">
          {cover.mark}
        </Mark>
      </div>
    </>
  );
}

function Corners({ color }: { color: string }) {
  const arm = "absolute size-[clamp(14px,4.5cqw,28px)] border-current";
  return (
    <div aria-hidden className="absolute inset-[6%]" style={{ color }}>
      <span className={cx(arm, "top-0 left-0 border-t-2 border-l-2")} />
      <span className={cx(arm, "top-0 right-0 border-t-2 border-r-2")} />
      <span className={cx(arm, "bottom-0 left-0 border-b-2 border-l-2")} />
      <span className={cx(arm, "right-0 bottom-0 border-r-2 border-b-2")} />
    </div>
  );
}

function Finder({ cover }: { cover: Extract<Cover, { kind: "finder" }> }) {
  const light = cover.ground === "paper";
  return (
    <>
      <Corners color={cover.accent} />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <Mark light={light} className="text-[clamp(3.25rem,17cqw,8rem)]">
          {cover.mark}
        </Mark>
        <Note light={light} className="mt-[0.6em]">
          {cover.note}
        </Note>
      </div>
    </>
  );
}

function ScriptPage({ cover }: { cover: Extract<Cover, { kind: "script" }> }) {
  return (
    <>
      <div aria-hidden className="absolute inset-y-[10%] left-[5%] flex flex-col justify-between">
        <span className="size-[clamp(6px,1.6cqw,9px)] rounded-full bg-ink/20" />
        <span className="size-[clamp(6px,1.6cqw,9px)] rounded-full bg-ink/20" />
        <span className="size-[clamp(6px,1.6cqw,9px)] rounded-full bg-ink/20" />
      </div>
      <div
        aria-hidden
        className="absolute inset-y-[8%] left-[9%] w-[3px]"
        style={{ background: cover.accent }}
      />
      <div className="absolute inset-y-[10%] right-[6%] left-[14%] flex flex-col justify-center font-script text-[clamp(10px,2.35cqw,16px)] leading-[1.45] text-ink">
        <p className="font-bold tracking-[0.04em] uppercase">{cover.slugline}</p>
        <p className="mt-[0.85em]">{cover.action}</p>
        <p className="mt-[0.85em] text-center font-bold tracking-[0.08em]">{cover.character}</p>
        <p className="mx-auto mt-[0.2em] max-w-[28ch] text-center">{cover.dialogue}</p>
      </div>
    </>
  );
}
