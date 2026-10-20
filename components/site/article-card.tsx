import Link from "next/link";

import { formatArticleDate, type ArticlePreview } from "@/lib/articles";
import { cx } from "@/lib/site";

import { ArticleCover, AuthorMark, coverRing } from "./article-cover";

export function ArticleCard({ article }: { article: ArticlePreview }) {
  return (
    <article className="h-full">
      <Link href={`/articles/${article.slug}`} className="group flex h-full flex-col">
        <div
          className={cx(
            "overflow-hidden rounded-[16px] ring-1 ring-inset transition-shadow duration-300 ease-out-strong",
            coverRing(article.cover.ground),
            article.cover.ground === "paper" ? "group-hover:ring-ink/25" : "group-hover:ring-paper/28",
          )}
        >
          <div className="origin-center transition-transform duration-500 ease-out-strong group-hover:scale-[1.03]">
            <ArticleCover cover={article.cover} />
          </div>
        </div>
        <h2 className="mt-4 text-[1.1875rem] leading-snug font-extrabold tracking-[-0.03em] text-balance [font-stretch:105%]">
          {article.title}
        </h2>
        <p className="mt-2 line-clamp-2 text-[14.5px] leading-relaxed text-paper/55">{article.excerpt}</p>
        <p className="mt-4 flex items-center gap-2.5 text-[13px]">
          <AuthorMark name={article.author.name} color={article.author.avatar} />
          <span className="font-medium text-paper/80">{article.author.name}</span>
          <span aria-hidden className="text-paper/30">
            ·
          </span>
          <time dateTime={article.published} className="text-paper/45">
            {formatArticleDate(article.published)}
          </time>
        </p>
      </Link>
    </article>
  );
}
