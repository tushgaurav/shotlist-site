import type { Metadata } from "next";

import { ArticleIndex } from "@/components/site/article-index";
import { JournalBar } from "@/components/site/journal-bar";
import { Nav } from "@/components/site/nav";
import { articlePreviews } from "@/lib/articles";

export const metadata: Metadata = {
  title: "shotlist - Articles",
  description: "How a production keeps the script and the shot list in the same conversation.",
};

export default function ArticlesPage() {
  return (
    <>
      <Nav />
      <main className="px-5 pt-28 pb-24 md:px-10 md:pt-36">
        <div className="mx-auto max-w-[1320px]">
          <header className="max-w-[40rem]">
            <h1 className="fade-up type-display text-[clamp(2.8rem,5.4vw,4.6rem)] leading-[0.88] [animation-delay:120ms]">
              Articles
            </h1>
            <p className="fade-up mt-5 max-w-[34rem] text-[clamp(1.05rem,1.25vw,1.2rem)] leading-relaxed text-paper/60 [animation-delay:220ms]">
              How a production keeps the script and the shot list in the same conversation.
            </p>
          </header>
          <ArticleIndex articles={articlePreviews()} />
        </div>
      </main>
      <JournalBar />
    </>
  );
}
