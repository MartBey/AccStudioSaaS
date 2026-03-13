"use client";

import { Element, useNode } from "@craftjs/core";
import React from "react";

import { ContainerBlock } from "./ContainerBlock";
import { TextBlock } from "./TextBlock";

export const FeatureBlock = () => {
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
        id="feature-container"
        is={ContainerBlock}
        padding="60px 20px"
        alignItems="center"
        backgroundColor="#ffffff"
        canvas
      >
        <Element
          id="feature-title"
          is={TextBlock}
          text="Our Core Features"
          fontSize="32px"
          textAlign="center"
          fontWeight="bold"
          color="#0f172a"
        />
        <Element
          id="feature-subtitle"
          is={TextBlock}
          text="Discover what makes us unique"
          fontSize="16px"
          textAlign="center"
          color="#64748b"
        />

        <Element
          id="feature-grid"
          is={ContainerBlock}
          padding="40px 0 0 0"
          flexDirection="row"
          justifyContent="center"
          alignItems="stretch"
          canvas
        >
          {/* Feature 1 */}
          <Element
            id="f1"
            is={ContainerBlock}
            padding="20px"
            margin="10px"
            backgroundColor="#f8fafc"
            borderRadius="8px"
            canvas
          >
            <Element
              id="f1-title"
              is={TextBlock}
              text="Fast Performance"
              fontSize="20px"
              fontWeight="bold"
              color="#0f172a"
            />
            <Element
              id="f1-desc"
              is={TextBlock}
              text="Optimized for speed and efficiency."
              fontSize="14px"
              color="#475569"
            />
          </Element>

          {/* Feature 2 */}
          <Element
            id="f2"
            is={ContainerBlock}
            padding="20px"
            margin="10px"
            backgroundColor="#f8fafc"
            borderRadius="8px"
            canvas
          >
            <Element
              id="f2-title"
              is={TextBlock}
              text="Modern Design"
              fontSize="20px"
              fontWeight="bold"
              color="#0f172a"
            />
            <Element
              id="f2-desc"
              is={TextBlock}
              text="Beautiful aesthetics that convert."
              fontSize="14px"
              color="#475569"
            />
          </Element>

          {/* Feature 3 */}
          <Element
            id="f3"
            is={ContainerBlock}
            padding="20px"
            margin="10px"
            backgroundColor="#f8fafc"
            borderRadius="8px"
            canvas
          >
            <Element
              id="f3-title"
              is={TextBlock}
              text="Easy Integration"
              fontSize="20px"
              fontWeight="bold"
              color="#0f172a"
            />
            <Element
              id="f3-desc"
              is={TextBlock}
              text="Connect with your favorite tools."
              fontSize="14px"
              color="#475569"
            />
          </Element>
        </Element>
      </Element>
    </div>
  );
};

export const FeatureSettings = () => {
  return (
    <div className="flex flex-col gap-4 rounded-md border bg-card p-4 text-card-foreground">
      <h3 className="text-sm font-semibold">Features Block</h3>
      <p className="text-xs text-muted-foreground">Select individual elements inside to edit.</p>
    </div>
  );
};

FeatureBlock.craft = {
  related: {
    settings: FeatureSettings,
  },
};
