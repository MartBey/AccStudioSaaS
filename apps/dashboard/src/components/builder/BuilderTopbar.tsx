"use client";

import React, { useState, useMemo } from "react";
import { useEditor, Element } from "@craftjs/core";
import { Button } from "ui";
import { Wand2, Save, Undo, Redo, LayoutTemplate } from "lucide-react";
import { parseAITreeToReactNode, type ComponentMap } from "web-builder/src/utils/craft-parser";
import { BuilderNode, BuilderSite, BlockType } from "web-builder/src/schema/builder-types";
import { TemplatesList } from "web-builder/src/templates";
import {
  HeroBlock,
  FeatureBlock,
  TextBlock,
  ButtonBlock,
  ContainerBlock,
  VideoReviewBlock,
  ImageBlock,
  FooterBlock,
  ContactBlock,
  TestimonialBlock,
  PricingBlock,
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
};

export const BuilderTopbar = ({ 
  onSave, 
  themeConfig, 
  setThemeConfig 
}: { 
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
        body: JSON.stringify({ prompt: promptInput, brandPersona: brandPersona.trim() || undefined }),
      });
      
      const data = await res.json();
      if (data.success && data.site) {
        console.log("AI Generated Site Structure:", data.site);
        
        // 1. Yeni düğümleri React Element'lerine çeviriyoruz (componentMap ile).
        data.site.nodes.forEach((node: BuilderNode) => {
          const reactElement = parseAITreeToReactNode(node, dashboardComponentMap);
          
          if (reactElement) {
              // 2. Element'i Craft.js Node'una çeviriyoruz.
              const craftNodeDesc = query.parseReactElement(reactElement as React.ReactElement).toNodeTree();
              
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
         setThemeConfig({ primary: template.themeConfig.primaryColor, font: template.themeConfig.fontFamily });
      }

      console.log("Loading Pre-built Template:", template);
      // Canvas'a enjekte et (componentMap ile)
      template.nodes.forEach((node: BuilderNode) => {
        const reactElement = parseAITreeToReactNode(node, dashboardComponentMap);
        if (reactElement) {
            const craftNodeDesc = query.parseReactElement(reactElement as React.ReactElement).toNodeTree();
            actions.addNodeTree(craftNodeDesc, "ROOT");
        }
      });
      alert("Hazır şablon başarıyla yüklendi!");
    } catch(err) {
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
        alert(`SEO Score: ${data.analysis.score}/100\n\nStrengths:\n- ${data.analysis.strengths.join("\n- ")}\n\nWeaknesses:\n- ${data.analysis.weaknesses.join("\n- ")}\n\nRecommendations:\n- ${data.analysis.recommendations.join("\n- ")}`);
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
    <div className="h-16 border-b bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="font-bold text-lg hidden md:block">AccStudio Builder</div>
        
        {/* Adım 4 & 6: Prompt & Brand Persona Alanı */}
        <div className="flex flex-col relative ml-4">
          <div className="flex items-center gap-2 max-w-xl w-[500px]">
            <input 
              type="text" 
              placeholder="E.g. Build me a dark themed coffee shop landing page..."
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              className="flex-1 h-9 px-3 text-sm rounded-md border bg-transparent"
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowPersonaInput(!showPersonaInput)}
              title="Add Brand Persona Context"
            >
              🎭
            </Button>
            <Button size="sm" onClick={handleGenerate} disabled={isGenerating || !promptInput.trim()}>
              {isGenerating ? "Generating..." : <><Wand2 className="w-4 h-4 mr-1" /> Magic</>}
            </Button>
            
            <Button 
              size="sm" 
              variant="secondary" 
              className="ml-2"
              onClick={() => setShowTemplatesModal(true)}
            >
              <LayoutTemplate className="w-4 h-4 mr-1" /> Templates
            </Button>
          </div>

          {showPersonaInput && (
            <div className="absolute top-10 left-0 w-full z-50 p-3 bg-card border rounded-md shadow-lg">
              <label className="text-xs font-semibold mb-1 block">Brand Persona (Optional)</label>
              <textarea
                value={brandPersona}
                onChange={(e) => setBrandPersona(e.target.value)}
                placeholder="Paste Brand Persona JSON/Rules here..."
                className="w-full h-24 p-2 text-xs border rounded-sm bg-background resize-none"
              />
            </div>
          )}

          {showTemplatesModal && (
            <div className="absolute top-10 left-0 w-[700px] z-50 p-4 bg-card border rounded-md shadow-xl flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
               <div className="flex justify-between items-center border-b pb-2 sticky top-0 bg-card z-10">
                 <h3 className="font-bold text-lg">Hazir Sablonlar</h3>
                 <Button variant="ghost" size="sm" onClick={() => setShowTemplatesModal(false)}>Kapat</Button>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 {TemplatesList.map((entry) => (
                   <div
                     key={entry.id}
                     className="border p-4 rounded-xl hover:border-primary cursor-pointer transition flex flex-col items-center text-center gap-2"
                     onClick={() => loadTemplate(entry.template)}
                   >
                     <div
                       className="w-full h-24 rounded-md mb-2 flex items-center justify-center"
                       style={{ backgroundColor: entry.template.themeConfig?.primaryColor || "#0f172a" }}
                     >
                       <span
                         className="font-bold text-sm"
                         style={{ color: entry.template.themeConfig?.secondaryColor || "#fff" }}
                       >
                         {entry.name}
                       </span>
                     </div>
                     <strong className="text-sm">{entry.name}</strong>
                     <p className="text-xs text-muted-foreground">{entry.description}</p>
                     <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full">{entry.category}</span>
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
             <div className="absolute top-10 right-0 w-64 z-50 p-3 bg-card border rounded-md shadow-lg flex flex-col gap-3">
                <label className="text-xs font-semibold">Global Theme Configuration</label>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground">Primary Color</span>
                  <div className="flex gap-2 items-center">
                     <input type="color" value={themeConfig.primary} onChange={e => setThemeConfig({...themeConfig, primary: e.target.value})} className="w-8 h-8 rounded" />
                     <span className="text-xs">{themeConfig.primary}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-muted-foreground">Typography</span>
                  <select value={themeConfig.font} onChange={e => setThemeConfig({...themeConfig, font: e.target.value})} className="text-xs p-1 border rounded">
                     <option>Inter</option>
                     <option>Roboto</option>
                     <option>Geist</option>
                     <option>Playfair Display</option>
                  </select>
                </div>
             </div>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleSeoAnalyze} disabled={isAnalyzingSeo} className="mr-2">
          {isAnalyzingSeo ? "Analyzing..." : "SEO Analyze"}
        </Button>
        <Button variant="outline" size="icon" onClick={() => actions.history.undo()} disabled={!canUndo}>
          <Undo className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => actions.history.redo()} disabled={!canRedo}>
          <Redo className="w-4 h-4" />
        </Button>
        <Button onClick={handleSave} className="ml-2 gap-2">
          <Save className="w-4 h-4" /> Save
        </Button>
      </div>
    </div>
  );
};
