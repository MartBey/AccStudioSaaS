"use client";

import { useNode } from "@craftjs/core";
import React from "react";

export interface ContactBlockProps {
  title?: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
}

export const ContactBlock = ({
  title = "Get In Touch",
  subtitle = "We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.",
  email = "hello@example.com",
  phone = "+90 555 123 45 67",
  backgroundColor = "#f8fafc",
  textColor = "#0f172a",
  accentColor = "#3b82f6",
}: ContactBlockProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{ width: "100%" }}
    >
      <section
        style={{
          backgroundColor,
          color: textColor,
          padding: "60px 20px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "32px",
          }}
        >
          {/* Heading */}
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "32px", fontWeight: "bold", margin: "0 0 8px 0" }}>{title}</h2>
            <p style={{ fontSize: "16px", color: "#64748b", maxWidth: "500px", margin: "0 auto" }}>
              {subtitle}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "40px",
              width: "100%",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {/* Form */}
            <div
              style={{
                flex: "1 1 320px",
                maxWidth: "400px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <input
                type="text"
                placeholder="Your Name"
                disabled
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                  backgroundColor: "#fff",
                }}
              />
              <input
                type="email"
                placeholder="Your Email"
                disabled
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                  backgroundColor: "#fff",
                }}
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                disabled
                style={{
                  padding: "12px 16px",
                  borderRadius: "8px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                  backgroundColor: "#fff",
                  resize: "none",
                }}
              />
              <button
                disabled
                style={{
                  padding: "12px 24px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: accentColor,
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "default",
                }}
              >
                Send Message
              </button>
            </div>

            {/* Info */}
            <div
              style={{
                flex: "1 1 220px",
                maxWidth: "300px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                justifyContent: "center",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    margin: "0 0 4px 0",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#64748b",
                  }}
                >
                  Email
                </p>
                <p style={{ fontSize: "15px", margin: 0 }}>{email}</p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    margin: "0 0 4px 0",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "#64748b",
                  }}
                >
                  Phone
                </p>
                <p style={{ fontSize: "15px", margin: 0 }}>{phone}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ContactSettings = () => {
  const {
    actions: { setProp },
    title,
    subtitle,
    email,
    phone,
    backgroundColor,
    accentColor,
  } = useNode((node) => ({
    title: node.data.props.title,
    subtitle: node.data.props.subtitle,
    email: node.data.props.email,
    phone: node.data.props.phone,
    backgroundColor: node.data.props.backgroundColor,
    accentColor: node.data.props.accentColor,
  }));

  return (
    <div className="flex flex-col gap-4 rounded-md border bg-card p-4 text-card-foreground">
      <h3 className="text-sm font-semibold">Contact Settings</h3>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Title</label>
        <input
          type="text"
          className="rounded-md border bg-background p-2 text-sm"
          value={title}
          onChange={(e) => setProp((props: ContactBlockProps) => (props.title = e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Subtitle</label>
        <textarea
          className="resize-none rounded-md border bg-background p-2 text-sm"
          rows={2}
          value={subtitle}
          onChange={(e) => setProp((props: ContactBlockProps) => (props.subtitle = e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Email</label>
        <input
          type="text"
          className="rounded-md border bg-background p-2 text-sm"
          value={email}
          onChange={(e) => setProp((props: ContactBlockProps) => (props.email = e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Phone</label>
        <input
          type="text"
          className="rounded-md border bg-background p-2 text-sm"
          value={phone}
          onChange={(e) => setProp((props: ContactBlockProps) => (props.phone = e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Background Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) =>
              setProp((props: ContactBlockProps) => (props.backgroundColor = e.target.value))
            }
            className="h-8 w-8 rounded border"
          />
          <span className="text-xs">{backgroundColor}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Accent Color (Button)</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={accentColor}
            onChange={(e) =>
              setProp((props: ContactBlockProps) => (props.accentColor = e.target.value))
            }
            className="h-8 w-8 rounded border"
          />
          <span className="text-xs">{accentColor}</span>
        </div>
      </div>
    </div>
  );
};

ContactBlock.craft = {
  defaultProps: {
    title: "Get In Touch",
    subtitle:
      "We'd love to hear from you. Send us a message and we'll get back to you as soon as possible.",
    email: "hello@example.com",
    phone: "+90 555 123 45 67",
    backgroundColor: "#f8fafc",
    textColor: "#0f172a",
    accentColor: "#3b82f6",
  },
  related: {
    settings: ContactSettings,
  },
};
