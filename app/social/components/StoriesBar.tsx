"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Plus, Lock } from "lucide-react";
import { getStories, getMediaPreview, type Post } from "@/lib/social";
import { timeAgo } from "@/lib/utils";

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
      <div className="flex gap-3 px-5 py-3 overflow-x-auto scrollbar-hide">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="w-16 h-16 rounded-full bg-white/5 animate-pulse" />
            <div className="w-10 h-2 rounded bg-white/5 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  if (stories.length === 0) return null;

  return (
    <div className="flex gap-3 px-5 py-3 overflow-x-auto scrollbar-hide">
      {stories.map((story, index) => {
        const isExpired =
          !story.pinned &&
          story.storyExpiresAt &&
          new Date(story.storyExpiresAt) < new Date();

        if (isExpired) return null;

        return (
          <motion.button
            key={story.$id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onStoryClick(story, index)}
            className="flex flex-col items-center gap-1.5 shrink-0 group"
          >
            {/* Ring + Thumbnail */}
            <div
              className={`relative p-[2.5px] rounded-full ${
                story.pinned
                  ? "bg-gradient-to-br from-accent via-primary to-secondary"
                  : "bg-gradient-to-br from-secondary to-primary"
              }`}
            >
              <div className="w-[60px] h-[60px] rounded-full bg-dark-bg p-[2px] overflow-hidden">
                {story.mediaFileIds.length > 0 ? (
                  <Image
                    src={getMediaPreview(story.mediaFileIds[0], 200, 200)}
                    alt={story.title}
                    width={60}
                    height={60}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/40 to-secondary/30 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {story.authorName?.[0] || "R"}
                    </span>
                  </div>
                )}
              </div>
              {/* Pinned badge */}
              {story.pinned && (
                <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center border-2 border-dark-bg">
                  <span className="text-[8px]">📌</span>
                </div>
              )}
            </div>
            {/* Label */}
            <span className="text-[10px] text-gray-400 w-16 text-center truncate font-medium group-hover:text-white transition-colors">
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
