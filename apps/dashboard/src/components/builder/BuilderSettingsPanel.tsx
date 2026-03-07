"use client";

import React from "react";
import { useEditor } from "@craftjs/core";

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
      <div className="w-72 border-l bg-card flex flex-col h-full p-4">
        <h2 className="text-lg font-semibold border-b pb-4 mb-4">Settings</h2>
        <div className="text-sm text-muted-foreground text-center py-8">
          Select a component on the canvas to see its settings here.
        </div>
      </div>
    );
  }

  return (
    <div className="w-72 border-l bg-card flex flex-col h-full overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Settings</h2>
        <span className="text-xs font-mono bg-muted px-2 py-1 rounded inline-block mt-2">
          {selected.data.name}
        </span>
      </div>

      <div className="p-4">
        {selected.related && selected.related.settings ? (
          React.createElement(selected.related.settings)
        ) : (
          <div className="text-sm text-muted-foreground">No settings available for this component.</div>
        )}
      </div>
    </div>
  );
};
