"use client";

import { useNode } from "@craftjs/core";
import React, { useState } from "react";
import { Button } from "ui";

export interface VideoReviewBlockProps {
  videoUrl?: string;
  title?: string;
}

export const VideoReviewBlock = ({
  videoUrl,
  title = "Video Review Component",
}: VideoReviewBlockProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{ margin: "10px 0", width: "100%" }}
    >
      <div className="relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-md border bg-card p-4">
        <h3 className="mb-2 text-lg font-semibold">{title}</h3>

        {videoUrl ? (
          <div className="group relative flex aspect-video w-full items-center justify-center rounded bg-black">
            {/* Fake Video Player for demo */}
            {!isPlaying ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/60">
                <Button
                  onClick={() => setIsPlaying(true)}
                  variant="secondary"
                  className="flex h-12 w-12 items-center justify-center rounded-full"
                >
                  ▶
                </Button>
              </div>
            ) : (
              <div className="absolute right-4 top-4 z-20">
                <Button
                  onClick={() => alert("UGC Review system opened for marker timestamp: 00:15")}
                  size="sm"
                  variant="default"
                >
                  Add Note/Review (00:15)
                </Button>
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.youtube.com/vi/${videoUrl.split("v=")[1] || "dQw4w9WgXcQ"}/maxresdefault.jpg`}
              alt="Video Thumbnail"
              className="h-full w-full object-cover opacity-50"
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center rounded border-2 border-dashed bg-muted text-muted-foreground">
            <span className="mb-2 text-4xl">📹</span>
            <p className="text-sm">Video Review Placeholder</p>
            <p className="text-xs">Add a video URL from settings to enable review mode</p>
          </div>
        )}
      </div>
    </div>
  );
};

const VideoReviewSettings = () => {
  const {
    actions: { setProp },
    videoUrl,
    title,
  } = useNode((node) => ({
    videoUrl: node.data.props.videoUrl,
    title: node.data.props.title,
  }));

  return (
    <div className="flex flex-col gap-4 rounded-md border bg-card p-4 text-card-foreground">
      <h3 className="text-sm font-semibold">Video Review (UGC) Settings</h3>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Title</label>
        <input
          type="text"
          className="rounded-md border bg-background p-2 text-sm"
          value={title}
          onChange={(e) =>
            setProp((props: VideoReviewBlockProps) => (props.title = e.target.value))
          }
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Video URL (YouTube)</label>
        <input
          type="text"
          className="rounded-md border bg-background p-2 text-sm"
          value={videoUrl || ""}
          onChange={(e) =>
            setProp((props: VideoReviewBlockProps) => (props.videoUrl = e.target.value))
          }
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>
    </div>
  );
};

VideoReviewBlock.craft = {
  defaultProps: {
    title: "Project Review Video",
    videoUrl: "",
  },
  related: {
    settings: VideoReviewSettings,
  },
};
