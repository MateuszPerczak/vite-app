import type { Position, State } from "../useCanvas.types";

export const renderGui = (context: CanvasRenderingContext2D, { gui }: State) => {
  const offset: Position = { x: 0, y: 0 };
  gui.drawables.forEach((drawable) =>
    drawable.render(context, {
      offset,
      showBounds: gui.showBounds,
      selected: false,
    }),
  );
};
