"use client";

import { useEditor } from "@craftjs/core";
import { Eye, LayoutTemplate, Redo, Save, Undo, Wand2 } from "lucide-react";
import React, { useState } from "react";
import { Button } from "ui";
import { BlockType, BuilderNode, BuilderSite } from "web-builder/src/schema/builder-types";
import { TemplatesList } from "web-builder/src/templates";
import { type ComponentMap, parseAITreeToReactNode } from "web-builder/src/utils/craft-parser";

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

// Dashboard tarafında tanımlanan BlockType -> Craft.js Bileşen eşlemesi
const dashboardComponentMap: ComponentMap = {
  [BlockType.Hero]: HeroBlock,
  [BlockType.Features]: FeatureBlock,
  [BlockType.Text]: TextBlock,
  [BlockType.Image]: ImageBlock,
  [BlockType.Button]: ButtonBlock,
  [BlockType.Footer]: FooterBlock,
  [BlockType.Contact]: ContactBlock,
  [BlockType.Testimonial]: TestimonialBlock,
  [BlockType.Container]: ContainerBlock,
  [BlockType.Pricing]: PricingBlock,
  [BlockType.VideoReview]: VideoReviewBlock,
  [BlockType.AnimatedHero]: AnimatedHeroBlock,
};

export const BuilderTopbar = ({
  siteId,
  onSave,
  themeConfig,
  setThemeConfig,
}: {
  siteId: string;
  onSave: (json: string) => void;
  themeConfig: { primary: string; font: string };
  setThemeConfig: React.Dispatch<React.SetStateAction<{ primary: string; font: string }>>;
}) => {
  const { actions, query, canUndo, canRedo } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  const [promptInput, setPromptInput] = useState("");
  const [brandPersona, setBrandPersona] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzingSeo, setIsAnalyzingSeo] = useState(false);
  const [showPersonaInput, setShowPersonaInput] = useState(false);
  const [showThemeInput, setShowThemeInput] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);

  const handleSave = () => {
    const json = query.serialize();
    onSave(json);
  };

  const handleGenerate = async () => {
    if (!promptInput.trim()) return;
    setIsGenerating(true);

    try {
      const res = await fetch("/api/builder/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptInput,
          brandPersona: brandPersona.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.site) {
        // 1. Yeni düğümleri React Element'lerine çeviriyoruz (componentMap ile).
        data.site.nodes.forEach((node: BuilderNode) => {
          const reactElement = parseAITreeToReactNode(node, dashboardComponentMap);

          if (reactElement) {
            // 2. Element'i Craft.js Node'una çeviriyoruz.
            const craftNodeDesc = query
              .parseReactElement(reactElement as React.ReactElement)
              .toNodeTree();

            // 3. Kök nesnenin (ROOT) içine yeni Node'ları dahil ediyoruz.
            actions.addNodeTree(craftNodeDesc, "ROOT");
          }
        });
      } else {
        alert("Failed to generate site: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error occurred during generation.");
    } finally {
      setIsGenerating(false);
      setPromptInput("");
    }
  };

  const loadTemplate = (template: BuilderSite) => {
    try {
      // Modalı Kapat
      setShowTemplatesModal(false);

      if (template.themeConfig) {
        setThemeConfig({
          primary: template.themeConfig.primaryColor,
          font: template.themeConfig.fontFamily,
        });
      }

      // Canvas'a enjekte et (componentMap ile)
      template.nodes.forEach((node: BuilderNode) => {
        const reactElement = parseAITreeToReactNode(node, dashboardComponentMap);
        if (reactElement) {
          const craftNodeDesc = query
            .parseReactElement(reactElement as React.ReactElement)
            .toNodeTree();
          actions.addNodeTree(craftNodeDesc, "ROOT");
        }
      });
      alert("Hazır şablon başarıyla yüklendi!");
    } catch (err) {
      console.error(err);
      alert("Şablon yüklenirken bir hata oluştu.");
    }
  };

  const handleSeoAnalyze = async () => {
    setIsAnalyzingSeo(true);
    try {
      const json = query.serialize();
      const res = await fetch("/api/builder/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteJson: json }),
      });
      const data = await res.json();
      if (data.success) {
        // Emit logic handled in parent or alert for demo
        alert(
          `SEO Score: ${data.analysis.score}/100\n\nStrengths:\n- ${data.analysis.strengths.join("\n- ")}\n\nWeaknesses:\n- ${data.analysis.weaknesses.join("\n- ")}\n\nRecommendations:\n- ${data.analysis.recommendations.join("\n- ")}`
        );
      } else {
        alert("SEO Error: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error parsing SEO.");
    } finally {
      setIsAnalyzingSeo(false);
    }
  };

  return (
    <div className="flex h-16 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-4">
        <div className="hidden text-lg font-bold md:block">AccStudio Builder</div>

        {/* Adım 4 & 6: Prompt & Brand Persona Alanı */}
        <div className="relative ml-4 flex flex-col">
          <div className="flex w-[500px] max-w-xl items-center gap-2">
            <input
              type="text"
              placeholder="E.g. Build me a dark themed coffee shop landing page..."
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="h-9 flex-1 rounded-md border bg-transparent px-3 text-sm"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPersonaInput(!showPersonaInput)}
              title="Add Brand Persona Context"
            >
              🎭
            </Button>
            <Button
              size="sm"
              onClick={handleGenerate}
              disabled={isGenerating || !promptInput.trim()}
            >
              {isGenerating ? (
                "Generating..."
              ) : (
                <>
                  <Wand2 className="mr-1 h-4 w-4" /> Magic
                </>
              )}
            </Button>

            <Button
              size="sm"
              variant="secondary"
              className="ml-2"
              onClick={() => setShowTemplatesModal(true)}
            >
              <LayoutTemplate className="mr-1 h-4 w-4" /> Templates
            </Button>
          </div>

          {showPersonaInput && (
            <div className="absolute left-0 top-10 z-50 w-full rounded-md border bg-card p-3 shadow-lg">
              <label className="mb-1 block text-xs font-semibold">Brand Persona (Optional)</label>
              <textarea
                value={brandPersona}
                onChange={(e) => setBrandPersona(e.target.value)}
                placeholder="Paste Brand Persona JSON/Rules here..."
                className="h-24 w-full resize-none rounded-sm border bg-background p-2 text-xs"
              />
            </div>
          )}

          {showTemplatesModal && (
            <div className="absolute left-0 top-10 z-50 flex max-h-[70vh] w-[700px] flex-col gap-4 overflow-y-auto rounded-md border bg-card p-4 shadow-xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-card pb-2">
                <h3 className="text-lg font-bold">Hazir Sablonlar</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowTemplatesModal(false)}>
                  Kapat
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {TemplatesList.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border p-4 text-center transition hover:border-primary"
                    onClick={() => loadTemplate(entry.template)}
                  >
                    <div
                      className="mb-2 flex h-24 w-full items-center justify-center rounded-md"
                      style={{
                        backgroundColor: entry.template.themeConfig?.primaryColor || "#0f172a",
                      }}
                    >
                      <span
                        className="text-sm font-bold"
                        style={{ color: entry.template.themeConfig?.secondaryColor || "#fff" }}
                      >
                        {entry.name}
                      </span>
                    </div>
                    <strong className="text-sm">{entry.name}</strong>
                    <p className="text-xs text-muted-foreground">{entry.description}</p>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px]">
                      {entry.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Button variant="ghost" size="sm" onClick={() => setShowThemeInput(!showThemeInput)}>
            🎨 Theme
          </Button>
          {showThemeInput && (
            <div className="absolute right-0 top-10 z-50 flex w-64 flex-col gap-3 rounded-md border bg-card p-3 shadow-lg">
              <label className="text-xs font-semibold">Global Theme Configuration</label>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground">Primary Color</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={themeConfig.primary}
                    onChange={(e) => setThemeConfig({ ...themeConfig, primary: e.target.value })}
                    className="h-8 w-8 rounded"
                  />
                  <span className="text-xs">{themeConfig.primary}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground">Typography</span>
                <select
                  value={themeConfig.font}
                  onChange={(e) => setThemeConfig({ ...themeConfig, font: e.target.value })}
                  className="rounded border p-1 text-xs"
                >
                  <option>Inter</option>
                  <option>Roboto</option>
                  <option>Geist</option>
                  <option>Playfair Display</option>
                </select>
              </div>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSeoAnalyze}
          disabled={isAnalyzingSeo}
          className="mr-2"
        >
          {isAnalyzingSeo ? "Analyzing..." : "SEO Analyze"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => actions.history.undo()}
          disabled={!canUndo}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => actions.history.redo()}
          disabled={!canRedo}
        >
          <Redo className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(`/preview/${siteId}`, "_blank")}
          className="gap-2"
        >
          <Eye className="h-4 w-4" /> Preview
        </Button>
        <Button onClick={handleSave} className="ml-2 gap-2">
          <Save className="h-4 w-4" /> Save
        </Button>
      </div>
    </div>
  );
};
