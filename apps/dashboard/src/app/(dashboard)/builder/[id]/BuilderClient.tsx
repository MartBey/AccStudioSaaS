"use client";

import React, { useState } from "react";
import { Editor, Frame, Element } from "@craftjs/core";
import { BuilderSidebar } from "@/components/builder/BuilderSidebar";
import { BuilderSettingsPanel } from "@/components/builder/BuilderSettingsPanel";
import { BuilderTopbar } from "@/components/builder/BuilderTopbar";
import {
  ContainerBlock,
  TextBlock,
  ButtonBlock,
  HeroBlock,
  FeatureBlock,
  VideoReviewBlock,
  ImageBlock,
  FooterBlock,
  ContactBlock,
  TestimonialBlock,
  PricingBlock,
} from "@/components/builder/blocks";
import { ContainerSettings } from "@/components/builder/blocks/ContainerBlock";

import { saveSite } from "./actions";

interface BuilderClientProps {
  initialState?: string;
  initialTheme?: string;
  siteId: string;
}

export const BuilderClient = ({ initialState, initialTheme, siteId }: BuilderClientProps) => {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  
  const parsedTheme = initialTheme ? JSON.parse(initialTheme) : { primary: "#0f172a", font: "Inter" };
  const [themeConfig, setThemeConfig] = useState(parsedTheme);

  const handleSave = async (json: string) => {
    setSaveStatus("saving");
    try {
      await saveSite(siteId, json, JSON.stringify(themeConfig));
      setSaveStatus("saved");
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background" style={{ fontFamily: themeConfig.font, ['--primary' as any]: themeConfig.primary }}>
      <Editor resolver={{ ContainerBlock, TextBlock, ButtonBlock, HeroBlock, FeatureBlock, VideoReviewBlock, ImageBlock, FooterBlock, ContactBlock, TestimonialBlock, PricingBlock, ContainerSettings }}>
        <div className="flex flex-col flex-1 w-full h-full">
          {/* Üst Bar */}
          <BuilderTopbar 
            onSave={handleSave} 
            themeConfig={themeConfig} 
            setThemeConfig={setThemeConfig} 
          />
          
          <div className="flex flex-1 overflow-hidden">
            {/* Sol Panel: Bileşenler */}
            <BuilderSidebar />
            
            {/* Orta Alan: Canvas */}
            <div className="flex-1 overflow-auto p-8 flex justify-center bg-zinc-100">
              <div className="w-full max-w-5xl bg-white min-h-[800px] shadow-sm ring-1 ring-zinc-200">
                <Frame data={initialState}>
                  {!initialState && (
                    <Element id="root" is={ContainerBlock} canvas padding="0" backgroundColor="#ffffff" minHeight="100%">
                      {/* Default Start */}
                       <Element is={ContainerBlock} padding="100px 20px" alignItems="center" canvas>
                          <Element is={TextBlock} text="Welcome to your new site!" fontSize="32px" fontWeight="bold" textAlign="center" color="#0f172a" />
                          <Element is={TextBlock} text="Drag components from the sidebar to start building." fontSize="16px" textAlign="center" color="#64748b" />
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
