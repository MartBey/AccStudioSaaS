"use client";

import React, { useState, useEffect } from "react";
import { useNode } from "@craftjs/core";
import ContentEditable from "react-contenteditable";

export interface TextBlockProps {
  text?: string;
  fontSize?: string;
  textAlign?: "left" | "center" | "right";
  color?: string;
  fontWeight?: "normal" | "bold" | "500" | "600" | "700";
}

export const TextBlock = ({ text = "Text", fontSize = "16px", textAlign = "left", color = "#000000", fontWeight = "normal" }: TextBlockProps) => {
  const { connectors: { connect, drag }, hasSelected, actions: { setProp } } = useNode((node) => ({
    hasSelected: node.events.selected,
  }));

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (!hasSelected) {
      setEditable(false);
    }
  }, [hasSelected]);

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      onClick={() => setEditable(true)}
      style={{ margin: "5px 0" }}
    >
      <ContentEditable
        html={text}
        disabled={!editable}
        onChange={(e) => {
          setProp((props: TextBlockProps) => (props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, "")));
        }}
        tagName="p"
        style={{
          fontSize,
          textAlign,
          color,
          fontWeight,
          outline: editable ? "1px dashed #3b82f6" : "none",
          minHeight: "1.5em",
        }}
      />
    </div>
  );
};

const TextSettings = () => {
  const { actions: { setProp }, fontSize, textAlign, color, fontWeight } = useNode((node) => ({
    fontSize: node.data.props.fontSize,
    textAlign: node.data.props.textAlign,
    color: node.data.props.color,
    fontWeight: node.data.props.fontWeight,
  }));

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md bg-card text-card-foreground">
      <h3 className="font-semibold text-sm">Text Settings</h3>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Font Size</label>
        <div className="flex gap-2">
          {["12px", "14px", "16px", "20px", "24px", "32px", "48px"].map((size) => (
            <button
              key={size}
              className={`px-2 py-1 border text-xs rounded ${fontSize === size ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setProp((props: TextBlockProps) => (props.fontSize = size))}
            >
              {size.replace('px', '')}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Text Align</label>
        <select
          className="p-2 border rounded-md text-sm bg-background"
          value={textAlign}
          onChange={(e) => setProp((props: TextBlockProps) => (props.textAlign = e.target.value))}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Font Weight</label>
        <select
          className="p-2 border rounded-md text-sm bg-background"
          value={fontWeight}
          onChange={(e) => setProp((props: TextBlockProps) => (props.fontWeight = e.target.value))}
        >
          <option value="normal">Normal</option>
          <option value="500">Medium</option>
          <option value="600">Semibold</option>
          <option value="bold">Bold</option>
        </select>
      </div>
      
       <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Color (Hex/CSS)</label>
        <input
          type="text"
          className="p-2 border rounded-md text-sm bg-background"
          value={color}
          onChange={(e) => setProp((props: TextBlockProps) => (props.color = e.target.value))}
        />
      </div>
    </div>
  );
};

TextBlock.craft = {
  defaultProps: {
    text: "Click to edit text",
    fontSize: "16px",
    textAlign: "left",
    fontWeight: "normal",
    color: "#ffffff",
  },
  related: {
    settings: TextSettings,
  },
};
