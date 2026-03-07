"use client";

import React from "react";
import { useNode } from "@craftjs/core";

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  ctaText?: string;
}

export interface PricingBlockProps {
  title?: string;
  subtitle?: string;
  plans?: PricingPlan[];
  backgroundColor?: string;
  accentColor?: string;
}

const defaultPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "$9/mo",
    features: ["1 User", "Basic Features", "Email Support"],
    highlighted: false,
    ctaText: "Get Started",
  },
  {
    name: "Pro",
    price: "$29/mo",
    features: ["Unlimited Users", "All Features", "Priority Support", "Custom Integrations"],
    highlighted: true,
    ctaText: "Start Free Trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited Everything", "Dedicated Manager", "SLA Guarantee", "On-Premise Option"],
    highlighted: false,
    ctaText: "Contact Us",
  },
];

export const PricingBlock = ({
  title = "Simple, Transparent Pricing",
  subtitle = "Choose the plan that fits your needs. Upgrade or downgrade anytime.",
  plans = defaultPlans,
  backgroundColor = "#ffffff",
  accentColor = "#3b82f6",
}: PricingBlockProps) => {
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
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "40px",
          }}
        >
          {/* Heading */}
          <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "32px", fontWeight: "bold", margin: "0 0 8px 0", color: "#0f172a" }}>{title}</h2>
            <p style={{ fontSize: "16px", color: "#64748b", margin: 0 }}>{subtitle}</p>
          </div>

          {/* Plans Grid */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {plans.map((plan, i) => (
              <div
                key={i}
                style={{
                  flex: "1 1 260px",
                  maxWidth: "340px",
                  border: plan.highlighted ? `2px solid ${accentColor}` : "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "32px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "20px",
                  backgroundColor: plan.highlighted ? "#f8fafc" : "#ffffff",
                  position: "relative",
                  boxShadow: plan.highlighted ? "0 4px 24px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {plan.highlighted && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-12px",
                      backgroundColor: accentColor,
                      color: "#ffffff",
                      padding: "4px 16px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: "600",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Most Popular
                  </span>
                )}

                <h3 style={{ fontSize: "18px", fontWeight: "600", margin: 0, color: "#0f172a" }}>{plan.name}</h3>
                <p style={{ fontSize: "36px", fontWeight: "bold", margin: 0, color: "#0f172a" }}>{plan.price}</p>

                <ul style={{ listStyle: "none", padding: 0, margin: 0, width: "100%", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {plan.features.map((feature, j) => (
                    <li
                      key={j}
                      style={{
                        fontSize: "14px",
                        color: "#475569",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ color: accentColor, fontWeight: "bold" }}>&#10003;</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  disabled
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "8px",
                    border: plan.highlighted ? "none" : `1px solid ${accentColor}`,
                    backgroundColor: plan.highlighted ? accentColor : "transparent",
                    color: plan.highlighted ? "#ffffff" : accentColor,
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "default",
                    marginTop: "auto",
                  }}
                >
                  {plan.ctaText || "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const PricingSettings = () => {
  const { actions: { setProp }, title, subtitle, backgroundColor, accentColor, plans } = useNode((node) => ({
    title: node.data.props.title,
    subtitle: node.data.props.subtitle,
    backgroundColor: node.data.props.backgroundColor,
    accentColor: node.data.props.accentColor,
    plans: node.data.props.plans,
  }));

  const updatePlan = (index: number, field: keyof PricingPlan, value: string | boolean | string[]) => {
    setProp((props: PricingBlockProps) => {
      if (props.plans) {
        const updated = [...props.plans];
        updated[index] = { ...updated[index], [field]: value };
        props.plans = updated;
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md bg-card text-card-foreground">
      <h3 className="font-semibold text-sm">Pricing Settings</h3>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Title</label>
        <input
          type="text"
          className="p-2 border rounded-md text-sm bg-background"
          value={title}
          onChange={(e) => setProp((props: PricingBlockProps) => (props.title = e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Subtitle</label>
        <input
          type="text"
          className="p-2 border rounded-md text-sm bg-background"
          value={subtitle}
          onChange={(e) => setProp((props: PricingBlockProps) => (props.subtitle = e.target.value))}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Accent Color</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setProp((props: PricingBlockProps) => (props.accentColor = e.target.value))}
            className="w-8 h-8 rounded border"
          />
          <span className="text-xs">{accentColor}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Background Color</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setProp((props: PricingBlockProps) => (props.backgroundColor = e.target.value))}
            className="w-8 h-8 rounded border"
          />
          <span className="text-xs">{backgroundColor}</span>
        </div>
      </div>

      {/* Plan editors */}
      {plans && plans.map((plan: PricingPlan, i: number) => (
        <div key={i} className="border rounded-md p-3 flex flex-col gap-2 bg-muted/50">
          <span className="text-xs font-semibold text-muted-foreground uppercase">Plan {i + 1}</span>
          <input
            type="text"
            className="p-1.5 border rounded text-xs bg-background"
            value={plan.name}
            onChange={(e) => updatePlan(i, "name", e.target.value)}
            placeholder="Plan name"
          />
          <input
            type="text"
            className="p-1.5 border rounded text-xs bg-background"
            value={plan.price}
            onChange={(e) => updatePlan(i, "price", e.target.value)}
            placeholder="Price"
          />
          <input
            type="text"
            className="p-1.5 border rounded text-xs bg-background"
            value={plan.ctaText || ""}
            onChange={(e) => updatePlan(i, "ctaText", e.target.value)}
            placeholder="CTA Button text"
          />
          <textarea
            className="p-1.5 border rounded text-xs bg-background resize-none"
            rows={2}
            value={plan.features.join("\n")}
            onChange={(e) => updatePlan(i, "features", e.target.value.split("\n"))}
            placeholder="One feature per line"
          />
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={plan.highlighted || false}
              onChange={(e) => updatePlan(i, "highlighted", e.target.checked)}
              className="rounded"
            />
            Highlighted (Popular)
          </label>
        </div>
      ))}
    </div>
  );
};

PricingBlock.craft = {
  defaultProps: {
    title: "Simple, Transparent Pricing",
    subtitle: "Choose the plan that fits your needs. Upgrade or downgrade anytime.",
    plans: defaultPlans,
    backgroundColor: "#ffffff",
    accentColor: "#3b82f6",
  },
  related: {
    settings: PricingSettings,
  },
};
