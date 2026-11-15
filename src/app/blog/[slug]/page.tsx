import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2 } from "lucide-react";
import Navbar from "@/components/home/navbar";
import Footer from "@/components/home/footer";
import { BLOG_POSTS } from "@/lib/blog-data";

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1 py-14 md:py-20">
        <article className="container-page max-w-3xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Back to all articles
          </Link>

          {/* Article Header */}
          <header className="space-y-5 border-b border-border/80 pb-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
              {post.category}
            </div>

            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-[1.12]">
              {post.title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author info */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="h-10 w-10 rounded-full object-cover border border-border"
                />
                <div>
                  <p className="font-semibold text-foreground text-sm">{post.author.name}</p>
                  <p className="text-muted-foreground">{post.author.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {post.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readTime}
                </span>
              </div>
            </div>
          </header>

          {/* Article Body */}
          <div className="py-10 space-y-6 text-base sm:text-lg leading-relaxed text-zinc-300">
            {post.content.map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Bottom Card: Early Access CTA */}
          <div className="mt-12 rounded-2xl border border-purple-500/30 bg-linear-to-br from-purple-950/30 via-card to-card p-8 text-center shadow-elevated">
            <h3 className="font-display text-2xl font-semibold text-foreground">
              Ready to modernize your agency's client experience?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
              Join elite agencies managing deliverables, approvals, and milestone payments with SDX26.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary/90 transition-colors"
              >
                Get Started for Free
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

