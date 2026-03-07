"use client";

import React from "react";
import { useNode } from "@craftjs/core";

export interface TestimonialBlockProps {
  quote?: string;
  author?: string;
  role?: string;
  avatarUrl?: string;
  rating?: number;
  backgroundColor?: string;
  accentColor?: string;
}

export const TestimonialBlock = ({
  quote = "This product completely transformed how we work. The results have been outstanding and the team support is incredible.",
  author = "John Doe",
  role = "CEO, TechCorp",
  avatarUrl = "",
  rating = 5,
  backgroundColor = "#ffffff",
  accentColor = "#f59e0b",
}: TestimonialBlockProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
      style={{ width: "100%" }}
    >
      <section
        style={{
          backgroundColor,
          padding: "60px 20px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "20px",
          }}
        >
          {/* Stars */}
          {rating > 0 && (
            <div style={{ display: "flex", gap: "4px" }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: "22px",
                    color: i < rating ? accentColor : "#e2e8f0",
                  }}
                >
                  &#9733;
                </span>
              ))}
            </div>
          )}

          {/* Quote */}
          <blockquote
            style={{
              fontSize: "20px",
              lineHeight: "1.6",
              color: "#334155",
              fontStyle: "italic",
              margin: 0,
              position: "relative",
              padding: "0 20px",
            }}
          >
            <span style={{ fontSize: "40px", color: "#cbd5e1", lineHeight: 0, verticalAlign: "-16px", marginRight: "4px" }}>&ldquo;</span>
            {quote}
            <span style={{ fontSize: "40px", color: "#cbd5e1", lineHeight: 0, verticalAlign: "-16px", marginLeft: "4px" }}>&rdquo;</span>
          </blockquote>

          {/* Author */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={author}
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "#e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#64748b",
                }}
              >
                {author.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ textAlign: "left" }}>
              <p style={{ margin: 0, fontWeight: "600", fontSize: "15px", color: "#0f172a" }}>{author}</p>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>{role}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const TestimonialSettings = () => {
  const { actions: { setProp }, quote, author, role, avatarUrl, rating, backgroundColor, accentColor } = useNode((node) => ({
    quote: node.data.props.quote,
    author: node.data.props.author,
    role: node.data.props.role,
    avatarUrl: node.data.props.avatarUrl,
    rating: node.data.props.rating,
    backgroundColor: node.data.props.backgroundColor,
    accentColor: node.data.props.accentColor,
  }));

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md bg-card text-card-foreground">
      <h3 className="font-semibold text-sm">Testimonial Settings</h3>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Quote</label>
        <textarea
          className="p-2 border rounded-md text-sm bg-background resize-none"
          rows={3}
          value={quote}
          onChange={(e) => setProp((props: TestimonialBlockProps) => (props.quote = e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Author Name</label>
        <input
          type="text"
          className="p-2 border rounded-md text-sm bg-background"
          value={author}
          onChange={(e) => setProp((props: TestimonialBlockProps) => (props.author = e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Author Role / Company</label>
        <input
          type="text"
          className="p-2 border rounded-md text-sm bg-background"
          value={role}
          onChange={(e) => setProp((props: TestimonialBlockProps) => (props.role = e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Avatar URL</label>
        <input
          type="text"
          className="p-2 border rounded-md text-sm bg-background"
          value={avatarUrl || ""}
          onChange={(e) => setProp((props: TestimonialBlockProps) => (props.avatarUrl = e.target.value))}
          placeholder="https://example.com/avatar.jpg"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Rating (0-5 stars)</label>
        <select
          className="p-2 border rounded-md text-sm bg-background"
          value={rating}
          onChange={(e) => setProp((props: TestimonialBlockProps) => (props.rating = Number(e.target.value)))}
        >
          <option value="0">No stars</option>
          <option value="1">1 star</option>
          <option value="2">2 stars</option>
          <option value="3">3 stars</option>
          <option value="4">4 stars</option>
          <option value="5">5 stars</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Background Color</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setProp((props: TestimonialBlockProps) => (props.backgroundColor = e.target.value))}
            className="w-8 h-8 rounded border"
          />
          <span className="text-xs">{backgroundColor}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Star Color</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setProp((props: TestimonialBlockProps) => (props.accentColor = e.target.value))}
            className="w-8 h-8 rounded border"
          />
          <span className="text-xs">{accentColor}</span>
        </div>
      </div>
    </div>
  );
};

TestimonialBlock.craft = {
  defaultProps: {
    quote: "This product completely transformed how we work. The results have been outstanding and the team support is incredible.",
    author: "John Doe",
    role: "CEO, TechCorp",
    avatarUrl: "",
    rating: 5,
    backgroundColor: "#ffffff",
    accentColor: "#f59e0b",
  },
  related: {
    settings: TestimonialSettings,
  },
};
