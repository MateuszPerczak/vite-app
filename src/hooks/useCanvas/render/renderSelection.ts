import type { State } from "../useCanvas.types";

export const renderSelection = (
  context: CanvasRenderingContext2D,
  { mouse: { clickedPos, position }, selectedDrawablesId }: State,
) => {
  if (clickedPos === null || selectedDrawablesId !== null) return;
  context.rect(
    clickedPos.x,
    clickedPos.y,
    position.x - clickedPos.x,
    position.y - clickedPos.y,
  );
  context.strokeStyle = "#fff";
  context.stroke();
};
