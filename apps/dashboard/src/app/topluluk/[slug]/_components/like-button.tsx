"use client";

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "ui";

import { likeBlogPost } from "@/app/_actions/blog-actions";

export default function LikeButton({
  postId,
  initialCount,
}: {
  postId: string;
  initialCount: number;
}) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    setCount((c) => c + 1);
    startTransition(async () => {
      await likeBlogPost(postId);
    });
  };

  return (
    <Button
      variant={liked ? "default" : "outline"}
      onClick={handleLike}
      disabled={isPending || liked}
      className="gap-2"
    >
      <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
      {count} Beğen
    </Button>
  );
}
