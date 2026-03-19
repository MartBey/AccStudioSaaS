"use client";

import { useNode } from "@craftjs/core";
import React from "react";
import { Button } from "ui";

export interface ButtonBlockProps {
  text?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  href?: string;
}

export const ButtonBlock = ({
  text = "Button",
  variant = "default",
  size = "default",
}: ButtonBlockProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{ display: "inline-block", margin: "5px 0" }}
    >
      <Button variant={variant} size={size}>
        {text}
      </Button>
    </div>
  );
};

const ButtonSettings = () => {
  const {
    actions: { setProp },
    text,
    variant,
    size,
    href,
  } = useNode((node) => ({
    text: node.data.props.text,
    variant: node.data.props.variant,
    size: node.data.props.size,
    href: node.data.props.href,
  }));

  return (
    <div className="flex flex-col gap-4 rounded-md border bg-card p-4 text-card-foreground">
      <h3 className="text-sm font-semibold">Button Settings</h3>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Text</label>
        <input
          type="text"
          className="rounded-md border bg-background p-2 text-sm"
          value={text}
          onChange={(e) => setProp((props: ButtonBlockProps) => (props.text = e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Variant</label>
        <select
          className="rounded-md border bg-background p-2 text-sm"
          value={variant}
          onChange={(e) =>
            setProp(
              (props: ButtonBlockProps) =>
                (props.variant = e.target.value as ButtonBlockProps["variant"])
            )
          }
        >
          <option value="default">Default</option>
          <option value="secondary">Secondary</option>
          <option value="outline">Outline</option>
          <option value="destructive">Destructive</option>
          <option value="ghost">Ghost</option>
          <option value="link">Link</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Size</label>
        <select
          className="rounded-md border bg-background p-2 text-sm"
          value={size}
          onChange={(e) =>
            setProp(
              (props: ButtonBlockProps) => (props.size = e.target.value as ButtonBlockProps["size"])
            )
          }
        >
          <option value="default">Default</option>
          <option value="sm">Small</option>
          <option value="lg">Large</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Link (Href)</label>
        <input
          type="text"
          className="rounded-md border bg-background p-2 text-sm"
          value={href || ""}
          onChange={(e) => setProp((props: ButtonBlockProps) => (props.href = e.target.value))}
          placeholder="https://..."
        />
      </div>
    </div>
  );
};

ButtonBlock.craft = {
  defaultProps: {
    text: "Click Me",
    variant: "default",
    size: "default",
    href: "",
  },
  related: {
    settings: ButtonSettings,
  },
};
