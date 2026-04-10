"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { getStories, getMediaPreview, type Post } from "@/lib/social";

interface StoriesBarProps {
  onStoryClick: (story: Post, index: number) => void;
  isLoggedIn: boolean;
}

export default function StoriesBar({
  onStoryClick,
  isLoggedIn,
}: StoriesBarProps) {
  const [stories, setStories] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const data = await getStories();
      setStories(data);
    } catch (err) {
      console.error("Failed to load stories:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex gap-4 px-4 py-3 overflow-x-auto scrollbar-hide">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 shrink-0">
            <div className="w-[68px] h-[68px] rounded-full bg-white/[0.04] animate-pulse" />
            <div className="w-12 h-2 rounded bg-white/[0.04] animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (stories.length === 0) return null;

  return (
    <div className="flex gap-4 px-4 py-3 overflow-x-auto scrollbar-hide">
      {stories.map((story, index) => {
        const isExpired =
          !story.pinned &&
          story.storyExpiresAt &&
          new Date(story.storyExpiresAt) < new Date();

        if (isExpired) return null;

        // Generate a gradient based on index
        const gradients = [
          "from-[#f09433] via-[#e6683c] to-[#dc2743]", // Instagram orange-red
          "from-[#833ab4] via-[#fd1d1d] to-[#fcb045]", // Instagram purple-orange
          "from-secondary via-primary to-accent",
          "from-[#405de6] via-[#833ab4] to-[#c13584]",
          "from-[#00d4ff] via-[#6200ea] to-[#ff0055]",
        ];
        const gradient = gradients[index % gradients.length];

        return (
          <motion.button
            key={story.$id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.04 }}
            onClick={() => onStoryClick(story, index)}
            className="flex flex-col items-center gap-1.5 shrink-0 group"
          >
            {/* Ring + Thumbnail */}
            <div
              className={`relative p-[2.5px] rounded-full bg-gradient-to-br ${gradient}`}
            >
              <div className="w-[64px] h-[64px] rounded-full bg-dark-bg p-[2.5px] overflow-hidden">
                {story.mediaFileIds.length > 0 ? (
                  <Image
                    src={getMediaPreview(story.mediaFileIds[0], 200, 200)}
                    alt={story.title}
                    width={64}
                    height={64}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-secondary/15 flex items-center justify-center">
                    <span className="text-base font-bold text-gray-300">
                      {story.authorName?.[0]?.toUpperCase() || "R"}
                    </span>
                  </div>
                )}
              </div>
              {/* Pinned badge */}
              {story.pinned && (
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-secondary flex items-center justify-center border-[2.5px] border-dark-bg">
                  <span className="text-[7px]">📌</span>
                </div>
              )}
            </div>
            {/* Label */}
            <span className="text-[10px] text-gray-400 w-[64px] text-center truncate font-medium group-hover:text-white transition-colors">
              {story.title.length > 8
                ? story.title.slice(0, 8) + "…"
                : story.title}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
