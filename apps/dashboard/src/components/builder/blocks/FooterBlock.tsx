"use client";

import React from "react";
import { useNode } from "@craftjs/core";

export interface FooterBlockProps {
  text?: string;
  backgroundColor?: string;
  textColor?: string;
  links?: { label: string; url: string }[];
  showSocials?: boolean;
}

export const FooterBlock = ({
  text = "\u00a9 2026 Company. All rights reserved.",
  backgroundColor = "#0f172a",
  textColor = "#94a3b8",
  links = [
    { label: "Privacy", url: "#" },
    { label: "Terms", url: "#" },
  ],
  showSocials = true,
}: FooterBlockProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{ width: "100%" }}
    >
      <footer
        style={{
          backgroundColor,
          color: textColor,
          padding: "40px 20px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Links */}
          {links && links.length > 0 && (
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center" }}>
              {links.map((link, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "14px",
                    cursor: "pointer",
                    textDecoration: "underline",
                    textUnderlineOffset: "4px",
                  }}
                >
                  {link.label}
                </span>
              ))}
            </div>
          )}

          {/* Socials */}
          {showSocials && (
            <div style={{ display: "flex", gap: "16px", fontSize: "18px" }}>
              <span style={{ cursor: "pointer" }} title="Twitter">&#120143;</span>
              <span style={{ cursor: "pointer" }} title="LinkedIn">in</span>
              <span style={{ cursor: "pointer" }} title="Instagram">&#9737;</span>
            </div>
          )}

          {/* Copyright */}
          <p style={{ fontSize: "13px", margin: 0, opacity: 0.7, textAlign: "center" }}>
            {text}
          </p>
        </div>
      </footer>
    </div>
  );
};

const FooterSettings = () => {
  const { actions: { setProp }, text, backgroundColor, textColor, showSocials } = useNode((node) => ({
    text: node.data.props.text,
    backgroundColor: node.data.props.backgroundColor,
    textColor: node.data.props.textColor,
    showSocials: node.data.props.showSocials,
  }));

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md bg-card text-card-foreground">
      <h3 className="font-semibold text-sm">Footer Settings</h3>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Copyright Text</label>
        <input
          type="text"
          className="p-2 border rounded-md text-sm bg-background"
          value={text}
          onChange={(e) => setProp((props: FooterBlockProps) => (props.text = e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Background Color</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setProp((props: FooterBlockProps) => (props.backgroundColor = e.target.value))}
            className="w-8 h-8 rounded border"
          />
          <span className="text-xs">{backgroundColor}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Text Color</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={textColor}
            onChange={(e) => setProp((props: FooterBlockProps) => (props.textColor = e.target.value))}
            className="w-8 h-8 rounded border"
          />
          <span className="text-xs">{textColor}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showSocials}
          onChange={(e) => setProp((props: FooterBlockProps) => (props.showSocials = e.target.checked))}
          className="rounded"
        />
        <label className="text-xs font-medium">Show Social Icons</label>
      </div>
    </div>
  );
};

FooterBlock.craft = {
  defaultProps: {
    text: "\u00a9 2026 Company. All rights reserved.",
    backgroundColor: "#0f172a",
    textColor: "#94a3b8",
    links: [
      { label: "Privacy", url: "#" },
      { label: "Terms", url: "#" },
    ],
    showSocials: true,
  },
  related: {
    settings: FooterSettings,
  },
};
