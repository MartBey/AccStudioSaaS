import { Element, NodeId } from "@craftjs/core";
import React from "react";
import { BuilderNode, BlockType } from "../schema/builder-types";
import {
  HeroBlock,
  FeaturesBlock,
  TextBlock,
  ButtonBlock,
  ContainerBlock,
  VideoReviewBlock
} from "@/components/builder/blocks";
import { v4 as uuidv4 } from "uuid";

// Harita: AI'ın BlockType ile Craft.js Bileşenlerini eşleştirme
const ComponentMap: Record<BlockType, React.ElementType | string> = {
  [BlockType.Hero]: HeroBlock,
  [BlockType.Features]: FeaturesBlock,
  [BlockType.Text]: TextBlock,
  [BlockType.Image]: "div", // Placeholder for now, or ImageBlock if it exists
  [BlockType.Button]: ButtonBlock,
  [BlockType.Footer]: ContainerBlock, // Temporarily map to Container until FooterBlock exists
  [BlockType.Contact]: ContainerBlock,
  [BlockType.Testimonial]: ContainerBlock,
  [BlockType.Container]: ContainerBlock,
  [BlockType.Pricing]: ContainerBlock,
  [BlockType.VideoReview]: VideoReviewBlock,
};

/**
 * AI'dan dönen JSON (BuilderNode) ağacını Craft.js Element nesnelerine çeviren parse fonksiyonu.
 * Craft.js `query.parseReactElement` işlemini topbarer'da kullanabilmek için bu parser ile React Tree çıkarıyoruz.
 */
export const parseAITreeToReactNode = (node: BuilderNode, keyPrefix = ""): React.ReactNode => {
  const Component = ComponentMap[node.type] || ContainerBlock;
  const props = node.props || {};

  // Benzersiz anahtarlar
  const currentKey = `${keyPrefix}-${node.id || uuidv4()}`;

  // Recursive alt bileşen işleme
  const childrenNodes = node.children && node.children.length > 0 
    ? node.children.map((child, idx) => parseAITreeToReactNode(child, `${currentKey}-${idx}`))
    : undefined;

  // Özel Text ve Button durumları için raw metin / data içeriği
  // Eğer component Text ise ve children vs. yoksa props.text'i veya children string'i verebiliriz
  // Şemamıza göre props içinde text/content var genelde, ama react node children olarak eklenecekse buraya eklenebilir.

  // Craft.js Element dönüşümü (Canvas içindeki raw React elemeleri)
  const isCanvas = (node.type === BlockType.Container || Component === ContainerBlock);
  
  if (isCanvas) {
    return React.createElement(Element, { key: currentKey, id: node.id, is: Component, canvas: true, ...props }, childrenNodes);
  }

  return React.createElement(Element, { key: currentKey, id: node.id, is: Component, ...props }, childrenNodes);
};
