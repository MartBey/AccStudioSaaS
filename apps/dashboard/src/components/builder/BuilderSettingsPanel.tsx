"use client";

import { useEditor } from "@craftjs/core";
import React from "react";

export const BuilderSettingsPanel = () => {
  const { selected, hasSelected } = useEditor((state) => {
    const selectedArray = Array.from(state.events.selected);
    const selectedId = selectedArray[0];

    return {
      selected: selectedId ? state.nodes[selectedId] : null,
      hasSelected: selectedArray.length > 0,
    };
  });

  if (!hasSelected || !selected) {
    return (
      <div className="flex h-full w-72 flex-col border-l bg-card p-4">
        <h2 className="mb-4 border-b pb-4 text-lg font-semibold">Settings</h2>
        <div className="py-8 text-center text-sm text-muted-foreground">
          Select a component on the canvas to see its settings here.
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-72 flex-col overflow-y-auto border-l bg-card">
      <div className="border-b p-4">
        <h2 className="text-lg font-semibold">Settings</h2>
        <span className="mt-2 inline-block rounded bg-muted px-2 py-1 font-mono text-xs">
          {selected.data.name}
        </span>
      </div>

      <div className="p-4">
        {selected.related && selected.related.settings ? (
          React.createElement(selected.related.settings)
        ) : (
          <div className="text-sm text-muted-foreground">
            No settings available for this component.
          </div>
        )}
      </div>
    </div>
  );
};
