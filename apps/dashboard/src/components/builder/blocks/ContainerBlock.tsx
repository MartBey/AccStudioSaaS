"use client";

import { useNode } from "@craftjs/core";
import React from "react";

export interface ContainerBlockProps {
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
  alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
  justifyContent?: "flex-start" | "center" | "space-between" | "space-around" | "space-evenly";
  flexDirection?: "row" | "column";
  minHeight?: string;
  borderRadius?: string;
}

export const ContainerBlock = ({
  padding = "0px",
  margin = "0px",
  backgroundColor = "transparent",
  children,
  alignItems = "stretch",
  justifyContent = "flex-start",
  flexDirection = "column",
  minHeight = "auto",
  borderRadius = "0px",
}: ContainerBlockProps) => {
  const {
    connectors: { connect, drag },
  } = useNode();

  return (
    <div
      ref={(ref) => {
        if (ref) connect(drag(ref));
      }}
      style={{
        padding,
        margin,
        backgroundColor,
        display: "flex",
        alignItems,
        justifyContent,
        flexDirection,
        minHeight,
        borderRadius,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
};

export const ContainerSettings = () => {
  const {
    actions: { setProp },
    padding,
    backgroundColor,
    flexDirection,
    alignItems,
    minHeight,
  } = useNode((node) => ({
    padding: node.data.props.padding,
    backgroundColor: node.data.props.backgroundColor,
    flexDirection: node.data.props.flexDirection,
    alignItems: node.data.props.alignItems,
    minHeight: node.data.props.minHeight,
  }));

  return (
    <div className="flex flex-col gap-4 rounded-md border bg-card p-4 text-card-foreground">
      <h3 className="text-sm font-semibold">Container Settings</h3>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Padding</label>
        <input
          type="text"
          className="rounded-md border bg-background p-2 text-sm"
          value={padding}
          onChange={(e) =>
            setProp((props: ContainerBlockProps) => (props.padding = e.target.value))
          }
          placeholder="e.g. 20px"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Background Color</label>
        <input
          type="text"
          className="rounded-md border bg-background p-2 text-sm"
          value={backgroundColor}
          onChange={(e) =>
            setProp((props: ContainerBlockProps) => (props.backgroundColor = e.target.value))
          }
          placeholder="e.g. #ffffff or transparent"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Min Height</label>
        <input
          type="text"
          className="rounded-md border bg-background p-2 text-sm"
          value={minHeight}
          onChange={(e) =>
            setProp((props: ContainerBlockProps) => (props.minHeight = e.target.value))
          }
          placeholder="e.g. 500px, 100vh"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Direction</label>
        <select
          className="rounded-md border bg-background p-2 text-sm"
          value={flexDirection}
          onChange={(e) =>
            setProp(
              (props: ContainerBlockProps) =>
                (props.flexDirection = e.target.value as ContainerBlockProps["flexDirection"])
            )
          }
        >
          <option value="column">Vertical</option>
          <option value="row">Horizontal</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Align Items</label>
        <select
          className="rounded-md border bg-background p-2 text-sm"
          value={alignItems}
          onChange={(e) =>
            setProp(
              (props: ContainerBlockProps) =>
                (props.alignItems = e.target.value as ContainerBlockProps["alignItems"])
            )
          }
        >
          <option value="flex-start">Start</option>
          <option value="center">Center</option>
          <option value="flex-end">End</option>
          <option value="stretch">Stretch</option>
        </select>
      </div>
    </div>
  );
};

ContainerBlock.craft = {
  defaultProps: {
    padding: "20px",
    margin: "0px",
    backgroundColor: "transparent",
    alignItems: "stretch",
    justifyContent: "flex-start",
    flexDirection: "column",
    minHeight: "auto",
    borderRadius: "0px",
  },
  related: {
    settings: ContainerSettings,
  },
};
