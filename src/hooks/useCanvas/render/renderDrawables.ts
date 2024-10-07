import type { Position, State } from "../useCanvas.types";

export const renderDrawables = (
  context: CanvasRenderingContext2D,
  { drawables, selectedDrawables, showBounds }: State,
) => {
  const offset: Position = { x: 0, y: 0 };
  drawables.forEach((drawable) =>
    drawable.render(context, {
      offset,
      showBounds,
      selected: selectedDrawables?.includes(drawable.id) ?? false,
    }),
  );
};
