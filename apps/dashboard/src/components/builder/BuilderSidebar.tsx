"use client";

import React from "react";
import { useEditor } from "@craftjs/core";
import {
  HeroBlock,
  TextBlock,
  FeatureBlock,
  ContainerBlock,
  ButtonBlock,
  VideoReviewBlock,
  ImageBlock,
  FooterBlock,
  ContactBlock,
  TestimonialBlock,
  PricingBlock,
} from "./blocks";

const sidebarItemBase = "p-3 border rounded block cursor-grab text-sm text-center font-medium transition-colors";
const basicStyle = `${sidebarItemBase} hover:bg-muted`;
const sectionStyle = `${sidebarItemBase} border-primary/20 bg-primary/5 hover:bg-primary/10`;
const smartStyle = `${sidebarItemBase} border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300`;

export const BuilderSidebar = () => {
  const { connectors } = useEditor();

  return (
    <div className="w-64 border-r bg-card flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Components</h2>
        <p className="text-xs text-muted-foreground mt-1">Drag elements to the canvas</p>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {/* ---- Basic Elements ---- */}
        <div className="mb-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Basic</h3>
        </div>

        <div
          ref={(ref) => { if(ref) connectors.create(ref, <ContainerBlock />) }}
          className={basicStyle}
        >
          Container
        </div>

        <div
          ref={(ref) => { if(ref) connectors.create(ref, <TextBlock text="New Text" />) }}
          className={basicStyle}
        >
          Text
        </div>

        <div
          ref={(ref) => { if(ref) connectors.create(ref, <ButtonBlock text="Button" variant="default" size="default" />) }}
          className={basicStyle}
        >
          Button
        </div>

        <div
          ref={(ref) => { if(ref) connectors.create(ref, <ImageBlock />) }}
          className={basicStyle}
        >
          Image
        </div>

        {/* ---- Sections ---- */}
        <div className="mt-4 mb-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sections</h3>
        </div>

        <div
          ref={(ref) => { if(ref) connectors.create(ref, <HeroBlock />) }}
          className={sectionStyle}
        >
          Hero Section
        </div>

        <div
          ref={(ref) => { if(ref) connectors.create(ref, <FeatureBlock />) }}
          className={sectionStyle}
        >
          Features Section
        </div>

        <div
          ref={(ref) => { if(ref) connectors.create(ref, <PricingBlock />) }}
          className={sectionStyle}
        >
          Pricing Section
        </div>

        <div
          ref={(ref) => { if(ref) connectors.create(ref, <TestimonialBlock />) }}
          className={sectionStyle}
        >
          Testimonial
        </div>

        <div
          ref={(ref) => { if(ref) connectors.create(ref, <ContactBlock />) }}
          className={sectionStyle}
        >
          Contact Section
        </div>

        <div
          ref={(ref) => { if(ref) connectors.create(ref, <FooterBlock />) }}
          className={sectionStyle}
        >
          Footer
        </div>

        {/* ---- Smart Layers ---- */}
        <div className="mt-4 mb-1">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Smart Layers</h3>
        </div>

        <div
          ref={(ref) => { if(ref) connectors.create(ref, <VideoReviewBlock />) }}
          className={smartStyle}
        >
          Video Review (UGC)
        </div>
      </div>
    </div>
  );
};
