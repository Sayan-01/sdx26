import React from "react";
import Link from "next/link";
import Navbar from "@/components/home/navbar";
import Footer from "@/components/home/footer";
import Eyebrow from "@/components/global/Eyebrow";
import Italic from "@/components/global/italic";
import { BLOG_POSTS } from "@/lib/blog-data";
import { ArrowRight, Clock, Calendar } from "lucide-react";

export const metadata = {
  title: "Blog - SDX26",
  description: "Insights, guides, and playbooks for scaling modern agencies and mastering client collaboration.",
};

export default function BlogListingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Blog Header */}
        <section className="relative overflow-hidden border-b border-border py-20 md:py-28">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 grid-bg opacity-[0.2] [mask-image:radial-gradient(ellipse_at_top,black_40%,transparent_80%)]"
          />
          <div className="container-page relative text-center">
            <Eyebrow>SDX26 Publication</Eyebrow>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Ideas for <Italic>exceptional</Italic> agencies.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg leading-relaxed">
              Real-world insights on agency operations, milestone management, and building high-trust client relationships.
            </p>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="container-page py-16 md:py-24">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="group relative flex flex-col justify-between rounded-[24px] border border-border/80 bg-card/60 p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/40 hover:bg-card hover:shadow-elevated"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="mt-5 font-display text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-purple-300">
                    <Link href={`/blog/${post.slug}`}>
                      <span className="absolute inset-0 z-10" />
                      {post.title}
                    </Link>
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-border/60 pt-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="h-8 w-8 rounded-full object-cover border border-border"
                    />
                    <div>
                      <p className="text-xs font-medium text-foreground">{post.author.name}</p>
                      <p className="text-[11px] text-muted-foreground">{post.date}</p>
                    </div>
                  </div>

                  <span className="inline-flex items-center text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
                    Read article <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

