import type { Mouse } from "../useCanvas.types";

export const renderMouse = (context: CanvasRenderingContext2D, { position }: Mouse) => {
  context.beginPath();
  context.fillStyle = "#fff";
  const { width } = context.measureText("M");
  context.fillText(`Mouse position ${position.x} ${position.y}`, 5, width + 5);
  context.stroke();
  context.closePath();
};
