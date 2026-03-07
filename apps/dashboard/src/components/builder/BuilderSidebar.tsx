"use client";

import React from "react";
import { useEditor } from "@craftjs/core";
import { HeroBlock, TextBlock, FeatureBlock, ContainerBlock, ButtonBlock, VideoReviewBlock } from "./blocks";

export const BuilderSidebar = () => {
  const { connectors } = useEditor();

  return (
    <div className="w-64 border-r bg-card flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Components</h2>
        <p className="text-xs text-muted-foreground mt-1">Drag elements to the canvas</p>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div 
          ref={(ref) => { if(ref) connectors.create(ref, <ContainerBlock />) }}
          className="p-3 border rounded block cursor-grab hover:bg-muted text-sm text-center font-medium"
        >
          Container
        </div>
        
        <div 
          ref={(ref) => { if(ref) connectors.create(ref, <TextBlock text="New Text" />) }}
          className="p-3 border rounded block cursor-grab hover:bg-muted text-sm text-center font-medium"
        >
          Text
        </div>
        
        <div 
          ref={(ref) => { if(ref) connectors.create(ref, <ButtonBlock text="Button" variant="default" size="default" />) }}
          className="p-3 border rounded block cursor-grab hover:bg-muted text-sm text-center font-medium"
        >
          Button
        </div>

        <div className="mt-4 mb-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sections</h3>
        </div>

        <div 
          ref={(ref) => { if(ref) connectors.create(ref, <HeroBlock />) }}
          className="p-3 border border-primary/20 bg-primary/5 rounded block cursor-grab hover:bg-primary/10 text-sm text-center font-medium"
        >
          Hero Section
        </div>
        
        <div 
          ref={(ref) => { if(ref) connectors.create(ref, <FeatureBlock />) }}
          className="p-3 border border-primary/20 bg-primary/5 rounded block cursor-grab hover:bg-primary/10 text-sm text-center font-medium"
        >
          Features Section
        </div>

        <div className="mt-4 mb-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Smart Layers</h3>
        </div>

        <div 
          ref={(ref) => { if(ref) connectors.create(ref, <VideoReviewBlock />) }}
          className="p-3 border border-indigo-500/30 bg-indigo-500/10 rounded block cursor-grab hover:bg-indigo-500/20 text-sm text-center font-medium text-indigo-700 dark:text-indigo-300"
        >
          Video Review (UGC)
        </div>
      </div>
    </div>
  );
};
