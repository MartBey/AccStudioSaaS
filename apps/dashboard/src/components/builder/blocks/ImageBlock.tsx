"use client";

import React from "react";
import { useNode } from "@craftjs/core";

export interface ImageBlockProps {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  objectFit?: "cover" | "contain" | "fill" | "none";
  borderRadius?: string;
}

export const ImageBlock = ({
  src = "",
  alt = "Image",
  width = "100%",
  height = "300px",
  objectFit = "cover",
  borderRadius = "8px",
}: ImageBlockProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{ width, margin: "10px 0" }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          style={{
            width: "100%",
            height,
            objectFit,
            borderRadius,
            display: "block",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height,
            borderRadius,
            backgroundColor: "#f1f5f9",
            border: "2px dashed #cbd5e1",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
          }}
        >
          <span style={{ fontSize: "36px", marginBottom: "8px" }}>🖼</span>
          <span style={{ fontSize: "14px" }}>Image Placeholder</span>
          <span style={{ fontSize: "11px" }}>Add an image URL from settings</span>
        </div>
      )}
    </div>
  );
};

const ImageSettings = () => {
  const { actions: { setProp }, src, alt, width, height, objectFit, borderRadius } = useNode((node) => ({
    src: node.data.props.src,
    alt: node.data.props.alt,
    width: node.data.props.width,
    height: node.data.props.height,
    objectFit: node.data.props.objectFit,
    borderRadius: node.data.props.borderRadius,
  }));

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md bg-card text-card-foreground">
      <h3 className="font-semibold text-sm">Image Settings</h3>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Image URL</label>
        <input
          type="text"
          className="p-2 border rounded-md text-sm bg-background"
          value={src || ""}
          onChange={(e) => setProp((props: ImageBlockProps) => (props.src = e.target.value))}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Alt Text</label>
        <input
          type="text"
          className="p-2 border rounded-md text-sm bg-background"
          value={alt}
          onChange={(e) => setProp((props: ImageBlockProps) => (props.alt = e.target.value))}
          placeholder="Describe the image"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Height</label>
        <input
          type="text"
          className="p-2 border rounded-md text-sm bg-background"
          value={height}
          onChange={(e) => setProp((props: ImageBlockProps) => (props.height = e.target.value))}
          placeholder="e.g. 300px, 50vh"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Object Fit</label>
        <select
          className="p-2 border rounded-md text-sm bg-background"
          value={objectFit}
          onChange={(e) => setProp((props: ImageBlockProps) => (props.objectFit = e.target.value as ImageBlockProps["objectFit"]))}
        >
          <option value="cover">Cover</option>
          <option value="contain">Contain</option>
          <option value="fill">Fill</option>
          <option value="none">None</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Border Radius</label>
        <input
          type="text"
          className="p-2 border rounded-md text-sm bg-background"
          value={borderRadius}
          onChange={(e) => setProp((props: ImageBlockProps) => (props.borderRadius = e.target.value))}
          placeholder="e.g. 8px, 50%"
        />
      </div>
    </div>
  );
};

ImageBlock.craft = {
  defaultProps: {
    src: "",
    alt: "Image",
    width: "100%",
    height: "300px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  related: {
    settings: ImageSettings,
  },
};
