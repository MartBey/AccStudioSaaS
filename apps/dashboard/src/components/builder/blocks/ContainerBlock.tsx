"use client";

import React from "react";
import { useNode } from "@craftjs/core";

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
  borderRadius = "0px"
}: ContainerBlockProps) => {
  const { connectors: { connect, drag } } = useNode();

  return (
    <div
      ref={(ref) => { if (ref) connect(drag(ref)); }}
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
        boxSizing: "border-box"
      }}
    >
      {children}
    </div>
  );
};

export const ContainerSettings = () => {
  const { actions: { setProp }, padding, backgroundColor, flexDirection, alignItems, minHeight } = useNode((node) => ({
    padding: node.data.props.padding,
    backgroundColor: node.data.props.backgroundColor,
    flexDirection: node.data.props.flexDirection,
    alignItems: node.data.props.alignItems,
    minHeight: node.data.props.minHeight,
  }));

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-md bg-card text-card-foreground">
      <h3 className="font-semibold text-sm">Container Settings</h3>
      
      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Padding</label>
        <input
          type="text"
          className="p-2 border rounded-md text-sm bg-background"
          value={padding}
          onChange={(e) => setProp((props: ContainerBlockProps) => (props.padding = e.target.value))}
          placeholder="e.g. 20px"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Background Color</label>
        <input
          type="text"
          className="p-2 border rounded-md text-sm bg-background"
          value={backgroundColor}
          onChange={(e) => setProp((props: ContainerBlockProps) => (props.backgroundColor = e.target.value))}
          placeholder="e.g. #ffffff or transparent"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Min Height</label>
        <input
          type="text"
          className="p-2 border rounded-md text-sm bg-background"
          value={minHeight}
          onChange={(e) => setProp((props: ContainerBlockProps) => (props.minHeight = e.target.value))}
          placeholder="e.g. 500px, 100vh"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Direction</label>
        <select
          className="p-2 border rounded-md text-sm bg-background"
          value={flexDirection}
          onChange={(e) => setProp((props: ContainerBlockProps) => (props.flexDirection = e.target.value))}
        >
          <option value="column">Vertical</option>
          <option value="row">Horizontal</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium">Align Items</label>
        <select
          className="p-2 border rounded-md text-sm bg-background"
          value={alignItems}
          onChange={(e) => setProp((props: ContainerBlockProps) => (props.alignItems = e.target.value))}
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
    borderRadius: "0px"
  },
  related: {
    settings: ContainerSettings,
  },
};
