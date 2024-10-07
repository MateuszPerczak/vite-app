import type { State } from "../useCanvas.types";

export const renderStats = (
  context: CanvasRenderingContext2D,
  { mouse, selectedDrawables }: State,
) => {
  // mouse
  context.beginPath();
  context.fillStyle = "#fff";
  const { width: height } = context.measureText("M");
  const { width } = context.measureText(
    `Mouse position: ${mouse.position.x} ${mouse.position.y}`,
  );
  context.fillText(
    `Mouse position: ${mouse.position.x} ${mouse.position.y}`,
    5,
    height + 5,
  );
  context.stroke();
  // selection

  context.fillText(
    `Selected: ${selectedDrawables === null ? "None" : selectedDrawables.toString()}`,
    width + 10,
    height + 5,
  );
  context.closePath();
};
