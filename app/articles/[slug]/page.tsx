import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/site/article-card";
import { ArticleCover, AuthorMark, coverRing } from "@/components/site/article-cover";
import { JournalBar } from "@/components/site/journal-bar";
import { Nav } from "@/components/site/nav";
import { ARTICLES, formatArticleDate, getArticle, relatedArticles } from "@/lib/articles";
import { cx } from "@/lib/site";

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(props: PageProps<"/articles/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) return { title: "shotlist - Article" };
  return {
    title: `shotlist - ${article.title}`,
    description: article.excerpt,
  };
}

export default async function ArticlePage(props: PageProps<"/articles/[slug]">) {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = relatedArticles(article.slug);

  return (
    <>
      <Nav />
      <main className="pt-28 pb-24 md:pt-36">
        <article className="mx-auto max-w-[760px] px-5">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-[13px] font-medium text-paper/55 transition-colors duration-200 hover:text-paper"
          >
            <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden>
              <path
                d="M10 3 5 8l5 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All articles
          </Link>
          <p className="mt-8 font-script text-[13px] tracking-[0.08em] text-lime uppercase">{article.category}</p>
          <h1 className="type-display mt-4 text-[clamp(2.5rem,5.6vw,4.75rem)] leading-[0.9] text-balance">
            {article.title}
          </h1>
          <p className="mt-6 max-w-[42rem] text-[clamp(1.08rem,1.3vw,1.25rem)] leading-relaxed text-paper/60">
            {article.excerpt}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-paper/10 py-4">
            <div className="flex items-center gap-3">
              <AuthorMark name={article.author.name} color={article.author.avatar} size="size-9" text="text-[12px]" />
              <div>
                <p className="text-[14px] font-semibold">{article.author.name}</p>
                <p className="font-script text-[12px] text-paper/45">{article.author.role}</p>
              </div>
            </div>
            <p className="text-[13px] text-paper/45 sm:ml-auto">
              <time dateTime={article.published}>{formatArticleDate(article.published)}</time>
              <span aria-hidden className="px-2 text-paper/25">
                ·
              </span>
              {article.minutes} min read
            </p>
          </div>
          <div className={cx("mt-10 overflow-hidden rounded-[20px] ring-1 ring-inset", coverRing(article.cover.ground))}>
            <ArticleCover cover={article.cover} />
          </div>
          <div className="mt-12 max-w-[66ch] space-y-7 text-[1.0625rem] leading-[1.75] text-paper/75">
            {article.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>

        <section className="mx-auto mt-20 max-w-[1320px] px-5 md:px-10" aria-labelledby="more-articles">
          <div className="flex items-end justify-between gap-4">
            <h2 id="more-articles" className="type-display text-[clamp(2rem,4vw,3.25rem)] leading-[0.9]">
              More articles
            </h2>
            <Link href="/articles" className="mb-1 text-[13px] font-medium text-paper/55 transition-colors hover:text-paper">
              All articles
            </Link>
          </div>
          <ul className="mt-8 grid grid-cols-1 gap-x-5 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <ArticleCard article={item} />
              </li>
            ))}
          </ul>
        </section>
      </main>
      <JournalBar />
    </>
  );
}
