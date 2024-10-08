import type { State } from "../useCanvas.types";

export const renderDrawables = (
  context: CanvasRenderingContext2D,
  { drawables, selectedDrawables, showBounds, constrain }: State,
) => {
  drawables.forEach((drawable) =>
    drawable.render(context, {
      constrain,
      showBounds,
      selected: selectedDrawables?.includes(drawable.id) ?? false,
    }),
  );
};
