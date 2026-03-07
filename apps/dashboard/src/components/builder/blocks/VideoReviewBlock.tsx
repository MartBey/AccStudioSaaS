"use client";

import React, { useState } from "react";
import { useNode } from "@craftjs/core";
import { Button } from "ui";

export interface VideoReviewBlockProps {
  videoUrl?: string;
  title?: string;
}

export const VideoReviewBlock = ({ videoUrl, title = "Video Review Component" }: VideoReviewBlockProps) => {
  const { connectors: { connect, drag } } = useNode();
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div ref={(ref) => { if (ref) connect(drag(ref)); }} style={{ margin: "10px 0", width: "100%" }}>
      <div className="border bg-card rounded-md overflow-hidden flex flex-col items-center justify-center p-4 relative min-h-[300px]">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        
        {videoUrl ? (
          <div className="w-full relative aspect-video bg-black rounded flex items-center justify-center group">
             {/* Fake Video Player for demo */}
             {!isPlaying ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-10">
                 <Button onClick={() => setIsPlaying(true)} variant="secondary" className="rounded-full w-12 h-12 flex items-center justify-center">▶</Button>
               </div>
             ) : (
               <div className="absolute top-4 right-4 z-20">
                 <Button onClick={() => alert("UGC Review system opened for marker timestamp: 00:15")} size="sm" variant="default">Add Note/Review (00:15)</Button>
               </div>
             )}
             {/* eslint-disable-next-line @next/next/no-img-element */}
             <img src={`https://img.youtube.com/vi/${videoUrl.split('v=')[1] || 'dQw4w9WgXcQ'}/maxresdefault.jpg`} alt="Video Thumbnail" className="w-full h-full object-cover opacity-50" />
          </div>
        ) : (
          <div className="w-full aspect-video bg-muted border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground rounded">
            <span className="text-4xl mb-2">📹</span>
            <p className="text-sm">Video Review Placeholder</p>
            <p className="text-xs">Add a video URL from settings to enable review mode</p>
          </div>
        )}

      </div>
    </div>
  );
};

const VideoReviewSettings = () => {
  const { actions: { setProp }, videoUrl, title } = useNode((node) => ({
    videoUrl: node.data.props.videoUrl,
    title: node.data.props.title,
  }));

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md bg-card text-card-foreground">
      <h3 className="font-semibold text-sm">Video Review (UGC) Settings</h3>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Title</label>
        <input
          type="text"
          className="p-2 border rounded-md text-sm bg-background"
          value={title}
          onChange={(e) => setProp((props: VideoReviewBlockProps) => (props.title = e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Video URL (YouTube)</label>
        <input
          type="text"
          className="p-2 border rounded-md text-sm bg-background"
          value={videoUrl || ""}
          onChange={(e) => setProp((props: VideoReviewBlockProps) => (props.videoUrl = e.target.value))}
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
