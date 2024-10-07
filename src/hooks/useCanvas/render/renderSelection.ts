import type { State } from "../useCanvas.types";

export const renderSelection = (
  context: CanvasRenderingContext2D,
  { mouse: { clickedPos, position }, selectedDrawables }: State,
) => {
  if (clickedPos === null || selectedDrawables !== null) return;
  context.rect(
    clickedPos.x,
    clickedPos.y,
    position.x - clickedPos.x,
    position.y - clickedPos.y,
  );
  context.strokeStyle = "#fff";
  context.stroke();
};
