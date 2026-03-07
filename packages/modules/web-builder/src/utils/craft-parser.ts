import React from "react";
import { BuilderNode, BlockType } from "../schema/builder-types";
import { v4 as uuidv4 } from "uuid";

/**
 * BlockType -> React Component eşleme haritası.
 * Dashboard tarafında oluşturulup parser'a parametre olarak geçilir.
 */
export type ComponentMap = Partial<Record<BlockType, React.ElementType>>;

/**
 * Varsayılan fallback bileşen. ComponentMap'te bulunamazsa "div" kullanılır.
 */
const FALLBACK_COMPONENT = "div";

export interface CraftParserOptions {
  componentMap: ComponentMap;
  fallbackComponent?: React.ElementType | string;
}

/**
 * CraftParser factory - belirli bir component haritası ile konfigüre edilmiş parser döndürür.
 * 
 * Kullanım (dashboard tarafında):
 * ```
 * const parser = createCraftParser({
 *   componentMap: {
 *     [BlockType.Hero]: HeroBlock,
 *     [BlockType.Features]: FeatureBlock,
 *     ...
 *   }
 * });
 * const reactNode = parser.parseNode(aiNode);
 * ```
 */
export function createCraftParser(options: CraftParserOptions) {
  const { componentMap, fallbackComponent = FALLBACK_COMPONENT } = options;

  const parseNode = (node: BuilderNode, keyPrefix = ""): React.ReactNode => {
    const Component = componentMap[node.type] || fallbackComponent;
    const props = node.props || {};

    // Benzersiz anahtarlar
    const currentKey = `${keyPrefix}-${node.id || uuidv4()}`;

    // Recursive alt bileşen işleme
    const childrenNodes = node.children && node.children.length > 0
      ? node.children.map((child, idx) => parseNode(child, `${currentKey}-${idx}`))
      : undefined;

    // Container tipi bloklar canvas olarak işaretlenir
    const isCanvas = node.type === BlockType.Container;

    if (isCanvas) {
      return React.createElement("div", { key: currentKey, id: node.id, ...props }, childrenNodes);
    }

    return React.createElement(Component as React.ElementType, { key: currentKey, id: node.id, ...props }, childrenNodes);
  };

  return { parseNode };
}

/**
 * Legacy uyumluluk: Doğrudan çağrılabilir fonksiyon.
 * Ama artık Craft.js Element oluşturma işini dashboard tarafına bırakıyoruz.
 * Bu fonksiyon componentMap olmadan sadece temel div yapısı üretir.
 */
export const parseAITreeToReactNode = (
  node: BuilderNode,
  componentMap?: ComponentMap,
  keyPrefix = ""
): React.ReactNode => {
  const Component = (componentMap && componentMap[node.type]) || FALLBACK_COMPONENT;
  const props = node.props || {};

  const currentKey = `${keyPrefix}-${node.id || uuidv4()}`;

  const childrenNodes = node.children && node.children.length > 0
    ? node.children.map((child, idx) => parseAITreeToReactNode(child, componentMap, `${currentKey}-${idx}`))
    : undefined;

  const isCanvas = node.type === BlockType.Container;

  if (isCanvas) {
    return React.createElement(Component as React.ElementType, { key: currentKey, id: node.id, canvas: true, ...props }, childrenNodes);
  }

  return React.createElement(Component as React.ElementType, { key: currentKey, id: node.id, ...props }, childrenNodes);
};
