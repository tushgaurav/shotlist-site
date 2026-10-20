import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

import { S_GLYPH, WORDMARK } from "@/components/site/logo";
import {
  authorInitials,
  formatArticleDate,
  getArticle,
  type Article,
  type AvatarColor,
  type Cover,
} from "@/lib/articles";

import { ogFonts } from "./fonts";

export const ogSize = { width: 1200, height: 630 };

const ACCENT: Record<string, string> = {
  "var(--color-orange)": "#ff6a3d",
  "var(--color-green)": "#19a65c",
  "var(--color-violet)": "#8574ff",
  "var(--color-blue)": "#4f8dff",
  "var(--color-yellow)": "#ffc62b",
  "var(--color-lime)": "#d9ff6b",
};

const AVATAR: Record<AvatarColor, { bg: string; fg: string }> = {
  orange: { bg: "#ff6a3d", fg: "#121212" },
  green: { bg: "#19a65c", fg: "#f3eee4" },
  violet: { bg: "#8574ff", fg: "#121212" },
  blue: { bg: "#4f8dff", fg: "#121212" },
  yellow: { bg: "#ffc62b", fg: "#121212" },
  lime: { bg: "#d9ff6b", fg: "#121212" },
};

function accentOf(cover: Cover) {
  if (cover.kind === "photo") return "#ff6a3d";
  return ACCENT[cover.accent] ?? "#ff6a3d";
}

async function photoDataUrl(src: string) {
  const response = await fetch(src);
  if (!response.ok) throw new Error(`Could not load cover image (${response.status})`);
  const type = response.headers.get("content-type")?.split(";")[0] || "image/jpeg";
  const bytes = Buffer.from(await response.arrayBuffer());
  return `data:${type};base64,${bytes.toString("base64")}`;
}

function titleSize(title: string) {
  if (title.length > 42) return 58;
  if (title.length > 32) return 66;
  return 76;
}

export async function articleOgImage(slug: string) {
  const article = getArticle(slug);
  if (!article) notFound();
  const photo = article.cover.kind === "photo" ? await photoDataUrl(article.cover.src) : undefined;

  return new ImageResponse(<Card article={article} photo={photo} />, {
    ...ogSize,
    fonts: ogFonts,
  });
}

function Card({ article, photo }: { article: Article; photo?: string }) {
  const avatar = AVATAR[article.author.avatar];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#121212",
        color: "#f3eee4",
        fontFamily: "Mona Sans",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 280,
          width: 560,
          height: 200,
          background:
            "radial-gradient(ellipse 72% 78% at 50% 42%, rgba(255,106,61,0.26) 0%, rgba(255,106,61,0.08) 36%, rgba(133,116,255,0.06) 58%, rgba(18,18,18,0) 76%)",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          padding: "56px 40px 48px 64px",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 11,
              background: "#ff6a3d",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg viewBox="-6.25 -1.33 23.5 23.5" width="46" height="46">
              <path d={S_GLYPH} fill="#121212" />
            </svg>
          </div>
          <svg viewBox="0 0 73 17" width="96" height="22" style={{ marginLeft: 14 }}>
            <path d={WORDMARK} fill="#f3eee4" />
          </svg>
        </div>

        <div
          style={{
            marginTop: 72,
            fontSize: 20,
            fontWeight: 500,
            letterSpacing: 3.4,
            textTransform: "uppercase",
            color: "#d9ff6b",
          }}
        >
          {article.category}
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: titleSize(article.title),
            fontWeight: 800,
            letterSpacing: -2.4,
            lineHeight: 0.92,
            color: "#f3eee4",
          }}
        >
          {article.title}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              background: avatar.bg,
              color: avatar.fg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 800,
            }}
          >
            {authorInitials(article.author.name)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: 12 }}>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.1 }}>{article.author.name}</div>
            <div style={{ marginTop: 3, fontSize: 16, fontWeight: 500, color: "rgba(243,238,228,0.5)" }}>
              {article.author.role}
            </div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 18, fontWeight: 500, color: "rgba(243,238,228,0.5)" }}>
            {formatArticleDate(article.published)}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", padding: "28px 28px 28px 0" }}>
        <CoverPanel cover={article.cover} photo={photo} />
      </div>
    </div>
  );
}

function CoverPanel({ cover, photo }: { cover: Cover; photo?: string }) {
  if (cover.kind === "photo" && photo) {
    return (
      <div
        style={{
          width: 420,
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          borderRadius: 28,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt=""
          width={420}
          height={574}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    );
  }

  const light = cover.ground === "paper";
  const fg = light ? "#121212" : "#f3eee4";
  const muted = light ? "rgba(18,18,18,0.5)" : "rgba(243,238,228,0.55)";
  const accent = accentOf(cover);

  return (
    <div
      style={{
        width: 420,
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        borderRadius: 28,
        background: light ? "#f3eee4" : "#222222",
      }}
    >
      {cover.kind === "slate" ? <Slate cover={cover} fg={fg} muted={muted} accent={accent} /> : null}
      {cover.kind === "clapper" ? <Clapper cover={cover} fg={fg} muted={muted} accent={accent} /> : null}
      {cover.kind === "finder" ? <Finder cover={cover} fg={fg} muted={muted} accent={accent} /> : null}
      {cover.kind === "script" ? <ScriptPage cover={cover} accent={accent} /> : null}
    </div>
  );
}

function Slate({
  cover,
  fg,
  muted,
  accent,
}: {
  cover: Extract<Cover, { kind: "slate" }>;
  fg: string;
  muted: string;
  accent: string;
}) {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: -90,
          bottom: -130,
          width: 360,
          height: 360,
          borderRadius: cover.shape === "circle" ? 180 : 64,
          background: accent,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 32,
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: muted,
        }}
      >
        {cover.note}
      </div>
      <div
        style={{
          position: "absolute",
          right: 28,
          bottom: 28,
          fontSize: cover.mark.length > 3 ? 78 : 104,
          fontWeight: 800,
          letterSpacing: -4,
          lineHeight: 0.8,
          color: fg,
        }}
      >
        {cover.mark}
      </div>
    </div>
  );
}

function Clapper({
  cover,
  fg,
  muted,
  accent,
}: {
  cover: Extract<Cover, { kind: "clapper" }>;
  fg: string;
  muted: string;
  accent: string;
}) {
  const stripes =
    "repeating-linear-gradient(-58deg, transparent 0 9px, rgba(18,18,18,0.88) 9px 18px)";

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: 32,
          right: 32,
          top: 40,
          height: 58,
          borderRadius: 6,
          background: accent,
          backgroundImage: stripes,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 32,
          right: 32,
          top: 112,
          height: 58,
          borderRadius: 6,
          background: accent,
          backgroundImage: stripes,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 32,
          bottom: 36,
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: muted,
        }}
      >
        {cover.note}
      </div>
      <div
        style={{
          position: "absolute",
          right: 32,
          bottom: 24,
          fontSize: 96,
          fontWeight: 800,
          letterSpacing: -4,
          lineHeight: 0.8,
          color: fg,
        }}
      >
        {cover.mark}
      </div>
    </div>
  );
}

function Finder({
  cover,
  fg,
  muted,
  accent,
}: {
  cover: Extract<Cover, { kind: "finder" }>;
  fg: string;
  muted: string;
  accent: string;
}) {
  const arm = {
    position: "absolute" as const,
    width: 32,
    height: 32,
    borderColor: accent,
    borderStyle: "solid" as const,
  };

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", position: "relative" }}>
      <div style={{ ...arm, top: 28, left: 28, borderTopWidth: 4, borderLeftWidth: 4 }} />
      <div style={{ ...arm, top: 28, right: 28, borderTopWidth: 4, borderRightWidth: 4 }} />
      <div style={{ ...arm, bottom: 28, left: 28, borderBottomWidth: 4, borderLeftWidth: 4 }} />
      <div style={{ ...arm, bottom: 28, right: 28, borderBottomWidth: 4, borderRightWidth: 4 }} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            fontSize: cover.mark.length > 3 ? 84 : 112,
            fontWeight: 800,
            letterSpacing: -4,
            lineHeight: 0.8,
            color: fg,
          }}
        >
          {cover.mark}
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 18,
            fontWeight: 500,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: muted,
          }}
        >
          {cover.note}
        </div>
      </div>
    </div>
  );
}

function ScriptPage({ cover, accent }: { cover: Extract<Cover, { kind: "script" }>; accent: string }) {
  return (
    <div style={{ display: "flex", width: "100%", height: "100%", position: "relative", background: "#f3eee4" }}>
      <div
        style={{
          position: "absolute",
          top: 48,
          bottom: 48,
          left: 28,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: 4, background: "rgba(18,18,18,0.22)" }} />
        <div style={{ width: 8, height: 8, borderRadius: 4, background: "rgba(18,18,18,0.22)" }} />
        <div style={{ width: 8, height: 8, borderRadius: 4, background: "rgba(18,18,18,0.22)" }} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 40,
          bottom: 40,
          left: 52,
          width: 4,
          background: accent,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          marginLeft: 76,
          marginRight: 28,
          width: 316,
          height: "100%",
          color: "#121212",
          fontFamily: "Courier Prime",
          fontSize: 20,
          lineHeight: 1.45,
        }}
      >
        <div style={{ fontWeight: 700, letterSpacing: 0.6, textTransform: "uppercase" }}>{cover.slugline}</div>
        <div style={{ marginTop: 18, fontWeight: 400 }}>{cover.action}</div>
        <div style={{ marginTop: 18, fontWeight: 700, letterSpacing: 1.4, textAlign: "center" }}>{cover.character}</div>
        <div style={{ marginTop: 4, fontWeight: 400, textAlign: "center" }}>{cover.dialogue}</div>
      </div>
    </div>
  );
}
