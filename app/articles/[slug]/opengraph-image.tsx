import { getArticle } from "@/lib/articles";
import { articleOgImage, ogSize } from "@/lib/og/article-image";

export async function generateImageMetadata({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await params;
  const article = getArticle(slug);

  return [
    {
      id: "card",
      alt: article ? article.title : "shotlist",
      size: ogSize,
      contentType: "image/png",
    },
  ];
}

export default async function Image({
  params,
  id,
}: {
  params: Promise<{ slug: string }>;
  id: Promise<string>;
}) {
  const { slug } = await params;
  await id;
  return articleOgImage(slug);
}
