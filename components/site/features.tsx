import { SPEC_URL, cx } from "@/lib/site";

import { Reveal, SlateLabel, SplitHeading } from "./reveal";
import { Glyph, type ShapeKind } from "./shapes";

const FEATURES: Array<{ title: string; body: string; glyph: ShapeKind; color: string }> = [
  {
    title: "Screenplay editor",
    body: "Proper formatting in Courier Prime. Enter and Tab move between elements, and INT. and EXT. are picked up as you type.",
    glyph: "circle",
    color: "text-violet",
  },
  {
    title: "Shot list",
    body: "A table or storyboard cards, grouped by scene and labeled 12A, 12B, 12C. It skips I and O, like a real slate.",
    glyph: "square",
    color: "text-green",
  },
  {
    title: "Side by side",
    body: "Whatever scene your cursor is in, its shots sit right next to the script.",
    glyph: "tag",
    color: "text-orange",
  },
  {
    title: "AI writing",
    body: "Press ⌘K to write or rewrite at the cursor, or draft from a logline. Nothing lands until you accept it.",
    glyph: "square",
    color: "text-yellow",
  },
  {
    title: "Reference frames",
    body: "Drop, paste or click to add an image to a shot. It's shrunk in the browser and stored in your own S3 bucket.",
    glyph: "circle",
    color: "text-blue",
  },
  {
    title: "Autosave and export",
    body: "Keeps working offline and refuses stale saves from other tabs. Export to Fountain or CSV.",
    glyph: "tag",
    color: "text-lime",
  },
];

export function Features() {
  return (
    <section id="features" className="px-5 py-[clamp(5rem,10vw,9rem)] md:px-10">
      <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SlateLabel scene="03">In the can</SlateLabel>
          <SplitHeading
            lines={["Already", "in the can."]}
            className="type-display mt-7 text-[clamp(2.7rem,6.4vw,7rem)] leading-[0.95]"
          />
          <Reveal delay={0.1} className="mt-8 max-w-[24rem] text-[clamp(1.05rem,1.25vw,1.2rem)] leading-relaxed text-paper/60">
            Everything here works today.
          </Reveal>
        </div>

        <div>
          <ol className="border-t border-paper/10">
            {FEATURES.map((feature, i) => (
              <Reveal
                as="li"
                key={feature.title}
                className="group grid grid-cols-[2.25rem_1fr] gap-x-4 border-b border-paper/10 py-7 sm:grid-cols-[3.5rem_1fr] sm:py-9"
              >
                <span className="pt-[0.55em] font-script text-[13px] text-paper/35">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="flex items-center gap-3 text-[clamp(1.5rem,2.4vw,2.25rem)] leading-tight font-extrabold tracking-[-0.035em] [font-stretch:108%]">
                    {feature.title}
                    <Glyph
                      kind={feature.glyph}
                      className={cx(
                        "h-[0.4em] transition-transform duration-500 ease-pop group-hover:scale-125 group-hover:-rotate-12",
                        feature.color,
                      )}
                    />
                  </h3>
                  <p className="mt-2.5 max-w-[46ch] text-[16px] leading-relaxed text-paper/55">{feature.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-10 grid grid-cols-[2.25rem_1fr] gap-x-4 sm:grid-cols-[3.5rem_1fr]">
            <span className="pt-1 font-script text-[13px] text-paper/35">→</span>
            <p className="max-w-[46ch] text-[16px] leading-relaxed text-paper/55">
              <span className="text-paper">Up next:</span> script versions and diffs, shoot days and setups, PDF export,
              and an on-set view for phones.{" "}
              <a
                href={SPEC_URL}
                target="_blank"
                rel="noreferrer"
                className="text-paper underline decoration-paper/30 underline-offset-4 transition-colors hover:decoration-lime"
              >
                Read the spec
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
