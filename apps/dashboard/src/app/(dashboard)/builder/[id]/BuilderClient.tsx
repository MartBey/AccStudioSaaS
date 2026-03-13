"use client";

import { Editor, Element, Frame } from "@craftjs/core";
import React, { useState } from "react";

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
import { ContainerSettings } from "@/components/builder/blocks/ContainerBlock";
import { BuilderSettingsPanel } from "@/components/builder/BuilderSettingsPanel";
import { BuilderSidebar } from "@/components/builder/BuilderSidebar";
import { BuilderTopbar } from "@/components/builder/BuilderTopbar";

import { saveSiteContent } from "@/app/_actions/site-actions";

interface BuilderClientProps {
  initialState?: string;
  initialTheme?: string;
  siteId: string;
}

export const BuilderClient = ({ initialState, initialTheme, siteId }: BuilderClientProps) => {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  const parsedTheme = initialTheme
    ? JSON.parse(initialTheme)
    : { primary: "#0f172a", font: "Inter" };
  const [themeConfig, setThemeConfig] = useState(parsedTheme);

  const handleSave = async (json: string) => {
    setSaveStatus("saving");
    try {
      await saveSiteContent(siteId, json, JSON.stringify(themeConfig));
      setSaveStatus("saved");
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  return (
    <div
      className="flex h-screen w-full bg-background"
      style={{ fontFamily: themeConfig.font, ["--primary" as any]: themeConfig.primary }}
    >
      <Editor
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
          ContainerSettings,
        }}
      >
        <div className="flex h-full w-full flex-1 flex-col">
          {/* Üst Bar */}
          <BuilderTopbar
            siteId={siteId}
            onSave={handleSave}
            themeConfig={themeConfig}
            setThemeConfig={setThemeConfig}
          />

          <div className="flex flex-1 overflow-hidden">
            {/* Sol Panel: Bileşenler */}
            <BuilderSidebar />

            {/* Orta Alan: Canvas */}
            <div className="flex flex-1 justify-center overflow-auto bg-zinc-100 p-8">
              <div className="min-h-[800px] w-full max-w-5xl bg-white shadow-sm ring-1 ring-zinc-200">
                <Frame data={initialState}>
                  {!initialState && (
                    <Element
                      id="root"
                      is={ContainerBlock}
                      canvas
                      padding="0"
                      backgroundColor="#ffffff"
                      minHeight="100%"
                    >
                      {/* Default Start */}
                      <Element is={ContainerBlock} padding="100px 20px" alignItems="center" canvas>
                        <Element
                          is={TextBlock}
                          text="Welcome to your new site!"
                          fontSize="32px"
                          fontWeight="bold"
                          textAlign="center"
                          color="#0f172a"
                        />
                        <Element
                          is={TextBlock}
                          text="Drag components from the sidebar to start building."
                          fontSize="16px"
                          textAlign="center"
                          color="#64748b"
                        />
                      </Element>
                    </Element>
                  )}
                </Frame>
              </div>
            </div>

            {/* Sağ Panel: Ayarlar */}
            <BuilderSettingsPanel />
          </div>
        </div>
      </Editor>
    </div>
  );
};
