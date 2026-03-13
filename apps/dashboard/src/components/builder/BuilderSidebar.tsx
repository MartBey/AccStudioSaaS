"use client";

import { useEditor } from "@craftjs/core";
import React from "react";

import {
  AnimatedHeroBlock,
  ButtonBlock,
  ContactBlock,
  ContainerBlock,
  FeatureBlock,
  FooterBlock,
  HeroBlock,
  ImageBlock,
  PricingBlock,
  TestimonialBlock,
  TextBlock,
  VideoReviewBlock,
} from "./blocks";

const sidebarItemBase =
  "p-3 border rounded block cursor-grab text-sm text-center font-medium transition-colors";
const basicStyle = `${sidebarItemBase} hover:bg-muted`;
const sectionStyle = `${sidebarItemBase} border-primary/20 bg-primary/5 hover:bg-primary/10`;
const smartStyle = `${sidebarItemBase} border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300`;

export const BuilderSidebar = () => {
  const { connectors } = useEditor();

  return (
    <div className="flex h-full w-64 flex-col overflow-y-auto border-r bg-card">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Components</h2>
        <p className="mt-1 text-xs text-muted-foreground">Drag elements to the canvas</p>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {/* ---- Basic Elements ---- */}
        <div className="mb-1">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Basic
          </h3>
        </div>

        <div
          ref={(ref) => {
            if (ref) connectors.create(ref, <ContainerBlock />);
          }}
          className={basicStyle}
        >
          Container
        </div>

        <div
          ref={(ref) => {
            if (ref) connectors.create(ref, <TextBlock text="New Text" />);
          }}
          className={basicStyle}
        >
          Text
        </div>

        <div
          ref={(ref) => {
            if (ref)
              connectors.create(
                ref,
                <ButtonBlock text="Button" variant="default" size="default" />
              );
          }}
          className={basicStyle}
        >
          Button
        </div>

        <div
          ref={(ref) => {
            if (ref) connectors.create(ref, <ImageBlock />);
          }}
          className={basicStyle}
        >
          Image
        </div>

        {/* ---- Sections ---- */}
        <div className="mb-1 mt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Sections
          </h3>
        </div>

        <div
          ref={(ref) => {
            if (ref) connectors.create(ref, <HeroBlock />);
          }}
          className={sectionStyle}
        >
          Hero Section
        </div>

        <div
          ref={(ref) => {
            if (ref) connectors.create(ref, <AnimatedHeroBlock />);
          }}
          className={smartStyle} // give it a special style
        >
          Animated Hero (Premium)
        </div>

        <div
          ref={(ref) => {
            if (ref) connectors.create(ref, <FeatureBlock />);
          }}
          className={sectionStyle}
        >
          Features Section
        </div>

        <div
          ref={(ref) => {
            if (ref) connectors.create(ref, <PricingBlock />);
          }}
          className={sectionStyle}
        >
          Pricing Section
        </div>

        <div
          ref={(ref) => {
            if (ref) connectors.create(ref, <TestimonialBlock />);
          }}
          className={sectionStyle}
        >
          Testimonial
        </div>

        <div
          ref={(ref) => {
            if (ref) connectors.create(ref, <ContactBlock />);
          }}
          className={sectionStyle}
        >
          Contact Section
        </div>

        <div
          ref={(ref) => {
            if (ref) connectors.create(ref, <FooterBlock />);
          }}
          className={sectionStyle}
        >
          Footer
        </div>

        {/* ---- Smart Layers ---- */}
        <div className="mb-1 mt-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Smart Layers
          </h3>
        </div>

        <div
          ref={(ref) => {
            if (ref) connectors.create(ref, <VideoReviewBlock />);
          }}
          className={smartStyle}
        >
          Video Review (UGC)
        </div>
      </div>
    </div>
  );
};
