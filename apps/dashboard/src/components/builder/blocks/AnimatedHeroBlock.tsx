"use client";

import { Element, useNode } from "@craftjs/core";
import { motion } from "framer-motion";
import React from "react";

import { ButtonBlock } from "./ButtonBlock";
import { ContainerBlock } from "./ContainerBlock";
import { TextBlock } from "./TextBlock";

export interface AnimatedHeroBlockProps {
  title?: string;
  subtitle?: string;
  badge?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export const AnimatedHeroBlock = ({
  title = "Design Meets Motion",
  subtitle = "Experience a new level of aesthetic with smooth, GSAP-like framer-motion animations that captivate your audience immediately.",
  badge = "✨ Premium Quality",
  primaryButtonText = "Start Building",
  secondaryButtonText = "View Showcase",
}: AnimatedHeroBlockProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{ width: "100%" }}
    >
      <Element
        id="anim-hero-root"
        is={ContainerBlock}
        padding="120px 20px"
        alignItems="center"
        backgroundColor="#0a0a0a"
        canvas
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto flex max-w-4xl flex-col items-center justify-center text-center"
        >
          <motion.div
            variants={itemVariants}
            className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md"
          >
            <span className="text-sm font-medium text-purple-400">{badge}</span>
          </motion.div>

          <motion.div variants={itemVariants} className="mb-6 w-full">
            <Element
              id="anim-hero-title"
              is={TextBlock}
              text={title}
              fontSize="64px"
              textAlign="center"
              fontWeight="bold"
              color="#ffffff"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="mb-8 w-full max-w-2xl">
            <Element
              id="anim-hero-subtitle"
              is={TextBlock}
              text={subtitle}
              fontSize="20px"
              textAlign="center"
              color="#a1a1aa"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="flex w-full justify-center gap-4">
            <Element
              id="anim-hero-actions"
              is={ContainerBlock}
              padding="0"
              flexDirection="row"
              justifyContent="center"
              backgroundColor="transparent"
              canvas
            >
              <Element
                id="anim-hero-btn-primary"
                is={ButtonBlock}
                text={primaryButtonText}
                variant="default"
                size="lg"
              />
              <div style={{ width: "16px" }}></div>
              <Element
                id="anim-hero-btn-sec"
                is={ButtonBlock}
                text={secondaryButtonText}
                variant="outline"
                size="lg"
              />
            </Element>
          </motion.div>
        </motion.div>
      </Element>
    </div>
  );
};

export const AnimatedHeroSettings = () => {
  return (
    <div className="flex flex-col gap-4 rounded-md border bg-card p-4 text-card-foreground">
      <h3 className="text-sm font-semibold">Animated Hero</h3>
      <p className="text-xs text-muted-foreground">
        Premium Apple-style animated hero section. Elements fade and slide up automatically.
      </p>
    </div>
  );
};

AnimatedHeroBlock.craft = {
  props: {
    title: "Design Meets Motion",
    subtitle:
      "Experience a new level of aesthetic with smooth, GSAP-like framer-motion animations that captivate your audience immediately.",
    badge: "✨ Premium Quality",
    primaryButtonText: "Start Building",
    secondaryButtonText: "View Showcase",
  },
  related: {
    settings: AnimatedHeroSettings,
  },
};
