import type { State } from "../useCanvas.types";

export const renderSelection = (
  context: CanvasRenderingContext2D,
  { mouse: { clickedPos, position, isMouseSelecting } }: State,
) => {
  if (clickedPos === null || !isMouseSelecting) return;
  context.beginPath();
  context.rect(
    clickedPos.x,
    clickedPos.y,
    position.x - clickedPos.x,
    position.y - clickedPos.y,
  );
  context.strokeStyle = "#fff";
  context.stroke();
  context.closePath();
};
