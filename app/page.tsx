import { Bands } from "@/components/site/bands";
import { CallSheet } from "@/components/site/call-sheet";
import { Credits } from "@/components/site/credits";
import { Features } from "@/components/site/features";
import { Hero } from "@/components/site/hero";
import { Nav } from "@/components/site/nav";
import { Problem } from "@/components/site/problem";
import { Product } from "@/components/site/product";
import { Rolling } from "@/components/site/rolling";
import { Wrap } from "@/components/site/wrap";

export const ensureStatic = "navigation";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="top">
        <Hero />
        <Bands />
        <Problem />
        <Product />
        <Features />
        <CallSheet />
        <Rolling />
        <Credits />
      </main>
      <Wrap />
    </>
  );
}
