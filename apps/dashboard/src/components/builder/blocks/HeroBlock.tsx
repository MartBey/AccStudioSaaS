"use client";

import { Element, useNode } from "@craftjs/core";
import React from "react";

import { ButtonBlock } from "./ButtonBlock";
import { ContainerBlock } from "./ContainerBlock";
import { TextBlock } from "./TextBlock";

export const HeroBlock = () => {
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
      <Element
        id="hero-container"
        is={ContainerBlock}
        padding="80px 20px"
        alignItems="center"
        backgroundColor="#f8fafc"
        canvas
      >
        <Element
          id="hero-title"
          is={TextBlock}
          text="Great Catchy Hero Title"
          fontSize="48px"
          textAlign="center"
          fontWeight="bold"
          color="#0f172a"
        />
        <Element
          id="hero-subtitle"
          is={TextBlock}
          text="This is a subtitle that explains what your product or service does. It's usually a bit longer and provides more context."
          fontSize="18px"
          textAlign="center"
          color="#64748b"
        />
        <Element
          id="hero-actions"
          is={ContainerBlock}
          padding="20px 0"
          flexDirection="row"
          justifyContent="center"
          canvas
        >
          <Element
            id="hero-btn-primary"
            is={ButtonBlock}
            text="Get Started"
            variant="default"
            size="lg"
          />
          <div style={{ width: "10px" }}></div>
          <Element
            id="hero-btn-sec"
            is={ButtonBlock}
            text="Learn More"
            variant="outline"
            size="lg"
          />
        </Element>
      </Element>
    </div>
  );
};

export const HeroSettings = () => {
  return (
    <div className="flex flex-col gap-4 rounded-md border bg-card p-4 text-card-foreground">
      <h3 className="text-sm font-semibold">Hero Block</h3>
      <p className="text-xs text-muted-foreground">
        Select individual elements inside the Hero to edit text, colors, or buttons.
      </p>
    </div>
  );
};

HeroBlock.craft = {
  related: {
    settings: HeroSettings,
  },
};
