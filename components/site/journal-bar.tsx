import Link from "next/link";

import { AUTHOR_URL, GITHUB_URL, SPEC_URL } from "@/lib/site";

import { Wordmark } from "./logo";

export function JournalBar() {
  return (
    <footer className="px-5 pb-8 md:px-10">
      <div className="mx-auto flex w-full max-w-[1320px] flex-wrap items-center justify-between gap-4 border-t border-paper/10 pt-6 text-[13px] text-paper/50">
        <div className="flex items-center gap-3">
          <Wordmark className="h-3.5 text-paper/80" />
          <span>© 2026</span>
        </div>
        <div className="flex items-center gap-5">
          <Link href="/" className="transition-colors hover:text-paper">
            Home
          </Link>
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-paper">
            GitHub
          </a>
          <a href={SPEC_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-paper">
            Spec
          </a>
          <a href={AUTHOR_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-paper">
            Made by tushgaurav
          </a>
        </div>
      </div>
    </footer>
  );
}
