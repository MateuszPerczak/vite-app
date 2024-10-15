import type { Drawables, Layer, Position } from "../useCanvas.types";

export const getMousePosition = (
  { clientX, clientY }: MouseEvent,
  { top, left, height, width }: DOMRect,
): Position => ({
  x: Math.min(Math.max(clientX - left, 0), width),
  y: Math.min(Math.max(clientY - top, 0), height),
});

export const getDrawablesFromPosition = (layer: Layer, { x, y }: Position) => {
  const matches = layer.drawables.filter(({ position, dimensions }) => {
    return (
      x >= position.x &&
      x <= position.x + dimensions.w &&
      y >= position.y &&
      y <= position.y + dimensions.h
    );
  });

  if (matches.length === 0) {
    return null;
  }

  return matches;
};

export const getDrawablesIds = (drawables: Drawables[] | null) => {
  if (drawables === null) {
    return null;
  }
  return drawables.map(({ id }) => id);
};
