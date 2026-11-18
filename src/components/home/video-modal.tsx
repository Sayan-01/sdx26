"use client";

import React, { useState } from "react";
import { Play } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface VideoModalProps {
  videoUrl?: string;
}

export function VideoModal({ videoUrl }: VideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to extract YouTube video ID and format embed URL with autoplay
  const getEmbedUrl = (url?: string) => {
    const defaultId = "yL1gsl_b4oI";
    if (!url) return `https://www.youtube.com/embed/${defaultId}?autoplay=1&rel=0`;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : defaultId;

    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center gap-2.5 rounded-md border border-border bg-surface px-5 py-3.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-2 cursor-pointer group"
        aria-label="Watch how SDX26 works walkthrough video"
      >
        <span className="sm:flex hidden items-center justify-center">
          <Play
            size={16}
            className="fill-foreground text-foreground transition-transform group-hover:scale-110"
          />
        </span>
        How It Works
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className="sm:max-w-4xl max-w-[95vw] p-0 overflow-hidden bg-black/95 border-border/80 shadow-2xl rounded-2xl gap-0"
          showCloseButton={true}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>SDX26 Product Walkthrough</DialogTitle>
            <DialogDescription>
              Watch how modern agencies collaborate with clients, manage milestones, and collect assets on SDX26.
            </DialogDescription>
          </DialogHeader>

          <div className="relative w-full aspect-video bg-black">
            {isOpen && (
              <iframe
                src={embedUrl}
                title="SDX26 Product Walkthrough"
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
