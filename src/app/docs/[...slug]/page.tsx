import React from "react";
import { notFound } from "next/navigation";
import { DOCS_DATA } from "@/lib/docs-data";
import { DocContentRenderer } from "@/components/docs/content-renderer";
import TableOfContents from "@/components/docs/table-of-contents";
import { ChevronRight } from "lucide-react";

export async function generateStaticParams() {
  const params = [];
  for (const category of DOCS_DATA) {
    for (const item of category.items) {
      params.push({ slug: [item.slug] });
    }
  }
  return params;
}

export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const currentSlug = slug[slug.length - 1];
  
  let currentDoc = null;
  let currentCategory = null;

  for (const category of DOCS_DATA) {
    const item = category.items.find((i) => i.slug === currentSlug);
    if (item) {
      currentDoc = item;
      currentCategory = category;
      break;
    }
  }

  if (!currentDoc || !currentCategory) {
    notFound();
  }

  return (
    <div className="flex gap-12 relative">
      <div className="flex-1 min-w-2xl">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-8">
          <span>Docs</span>
          <ChevronRight className="h-3 w-3" />
          <span>{currentCategory.title}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-indigo-400">{currentDoc.title}</span>
        </div>

        {/* Hero Section */}
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-white tracking-tight leading-tight">
            {currentDoc.title}
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed max-w-2xl">
            {currentDoc.description}
          </p>
        </div>

        <DocContentRenderer content={currentDoc.content} />

        {/* Footer Navigation */}
        <div className="mt-20 pt-8 border-t border-zinc-800 flex items-center justify-between">
            <p className="text-xs text-zinc-500 font-medium">Last updated: May 3, 2026</p>
            <div className="flex items-center gap-4">
                <button className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">Edit this page</button>
                <span className="w-1 h-1 rounded-full bg-zinc-800" />
                <button className="text-xs font-bold text-zinc-500 hover:text-white transition-colors">Join Discord</button>
            </div>
        </div>
      </div>
      
      {/* Right Sidebar - TOC */}
      <TableOfContents />
    </div>
  );
}
