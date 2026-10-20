"use client";

import { useState } from "react";

import { CATEGORIES, type ArticlePreview } from "@/lib/articles";
import { cx } from "@/lib/site";

import { ArticleCard } from "./article-card";

const TOPICS = ["All", ...CATEGORIES] as const;

export function ArticleIndex({ articles }: { articles: ArticlePreview[] }) {
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>("All");
  const visible = topic === "All" ? articles : articles.filter((article) => article.category === topic);

  return (
    <div className="mt-12">
      <div className="relative min-w-0">
          <div
            role="group"
            aria-label="Topics"
            className="-mx-5 flex gap-1 overflow-x-auto px-5 py-1 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {TOPICS.map((item) => {
              const selected = item === topic;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setTopic(item)}
                  className={cx(
                    "shrink-0 rounded-full px-3.5 py-2 text-[13px] font-medium transition-[color,background-color,transform] duration-200 ease-out-strong active:scale-[0.97]",
                    selected ? "bg-paper text-ink" : "text-paper/60 hover:text-paper",
                  )}
                >
                  {item}
                </button>
              );
            })}
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-ink to-transparent sm:hidden"
          />
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "article" : "articles"}
        {topic === "All" ? "" : ` in ${topic}`}.
      </p>
      <ul className="mt-8 grid grid-cols-1 gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((article) => (
          <li key={article.slug}>
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>
    </div>
  );
}
