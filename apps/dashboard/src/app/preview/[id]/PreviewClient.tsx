"use client";

import { Editor, Frame } from "@craftjs/core";
import React from "react";
import { ThemeConfig } from "types";

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
} from "@/components/builder/blocks";

interface PreviewClientProps {
  initialState?: string;
  initialTheme?: string;
}

export const PreviewClient = ({ initialState, initialTheme }: PreviewClientProps) => {
  const themeConfig: ThemeConfig = initialTheme
    ? JSON.parse(initialTheme)
    : { primary: "#0f172a", font: "Inter" };

  return (
    <div
      className="min-h-screen w-full bg-white"
      style={{
        fontFamily: themeConfig.font,
        ...({ "--primary": themeConfig.primary } as React.CSSProperties),
      }}
    >
      <Editor
        enabled={false}
        resolver={{
          ContainerBlock,
          TextBlock,
          ButtonBlock,
          HeroBlock,
          AnimatedHeroBlock,
          FeatureBlock,
          VideoReviewBlock,
          ImageBlock,
          FooterBlock,
          ContactBlock,
          TestimonialBlock,
          PricingBlock,
        }}
      >
        <Frame data={initialState} />
      </Editor>
    </div>
  );
};
