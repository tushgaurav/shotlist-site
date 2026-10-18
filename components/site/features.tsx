import { cx } from "@/lib/site";

import { Reveal, SlateLabel, SplitHeading } from "./reveal";
import {
  AiIllustration,
  AutosaveIllustration,
  BesideIllustration,
  CsvIllustration,
  EditorIllustration,
  FramesIllustration,
  SlateLetters,
} from "./tiles";

function Tile({
  className,
  title,
  body,
  children,
  delay = 0,
}: {
  className: string;
  title: string;
  body: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Reveal
      as="article"
      blur={false}
      delay={delay}
      className={cx("relative flex flex-col overflow-hidden rounded-[28px] p-4 text-ink sm:p-7", className)}
    >
      <div className="relative flex-1">{children}</div>
      <div className="mt-6 px-1 sm:px-0">
        <h3 className="text-[clamp(1.45rem,2vw,2rem)] leading-[1.02] font-extrabold tracking-[-0.035em] [font-stretch:108%]">
          {title}
        </h3>
        <p className="mt-2.5 max-w-[40ch] text-[15px] leading-relaxed text-ink/70">{body}</p>
      </div>
    </Reveal>
  );
}

export function Features() {
  return (
    <section id="features" className="px-3 py-[clamp(3.5rem,7vw,6.5rem)] md:px-6">
      <div className="mx-auto max-w-[1320px]">
        <div className="grid items-end gap-8 px-2 md:px-4 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <SlateLabel scene="03">In the can</SlateLabel>
            <SplitHeading
              lines={["Already", "in the can."]}
              className="type-display mt-7 text-[clamp(2.9rem,7.2vw,8rem)] leading-[0.88]"
            />
          </div>
          <Reveal delay={0.15} className="max-w-[28rem] text-[clamp(1.05rem,1.25vw,1.2rem)] leading-relaxed text-paper/65 lg:pb-3">
            Everything here works today. Point it at Postgres, open the editor, and start writing.
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-6 lg:grid-cols-12 lg:gap-4">
          <Tile
            className="bg-paper md:col-span-6 lg:col-span-7 lg:row-span-2"
            title="A real screenplay editor"
            body="Proper formatting in Courier Prime. Enter and Tab move between elements, INT. and EXT. are detected as you type, and characters and locations autocomplete."
          >
            <EditorIllustration />
          </Tile>
          <Tile
            className="bg-yellow md:col-span-3 lg:col-span-5"
            delay={0.08}
            title="Labels like a real slate"
            body="A table or storyboard cards, grouped by scene and labeled 12A, 12B, 12C. It skips I and O, because on a slate they read as 1 and 0."
          >
            <SlateLetters />
          </Tile>
          <Tile
            className="bg-green md:col-span-3 lg:col-span-5"
            delay={0.12}
            title="Autosave that won't eat your pages"
            body="Keeps a local copy when you're offline, refuses stale saves from other tabs, and exports to Fountain."
          >
            <AutosaveIllustration />
          </Tile>
          <Tile
            className="bg-orange md:col-span-6 lg:col-span-5 lg:row-span-2"
            title="AI that has read your script"
            body={
              <>
                Press <kbd className="rounded bg-ink/15 px-1 font-script text-[0.9em]">⌘K</kbd> to write or rewrite at the
                cursor, draft a whole script from your logline, chat with an assistant that proposes edits, or Tab through
                inline suggestions. Nothing lands until you accept it.
              </>
            }
          >
            <AiIllustration />
          </Tile>
          <Tile
            className="bg-violet md:col-span-6 lg:col-span-7"
            delay={0.08}
            title="Shots next to the script"
            body="A side panel shows the shots for whatever scene your cursor is in, and you can add more from there."
          >
            <BesideIllustration />
          </Tile>
          <Tile
            className="bg-blue md:col-span-3 lg:col-span-4"
            delay={0.08}
            title="Reference frames"
            body="Drop, paste or click to add an image to any shot. The browser shrinks it, then it goes straight to your own S3 bucket. Try it with any image."
          >
            <FramesIllustration />
          </Tile>
          <Tile
            className="bg-lime md:col-span-3 lg:col-span-3"
            delay={0.14}
            title="CSV export"
            body="For the AD who lives in Sheets."
          >
            <CsvIllustration />
          </Tile>
        </div>
      </div>
    </section>
  );
}
