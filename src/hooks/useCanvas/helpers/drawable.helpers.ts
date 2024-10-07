import type { Drawables, Position, State } from "../useCanvas.types";

export const getDrawablesFromPointing = ({ x, y }: Position, drawables: Drawables[]) => {
  const matches = drawables.filter(({ position, dimensions }) => {
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
  if (drawables === null) return null;
  return drawables.map(({ id }) => id);
};

export const getDrawablesFromId = (
  drawables: Drawables[] | null,
  ids: string[] | null,
) => {
  if (drawables === null || ids === null) return null;
  return drawables.filter(({ id }) => ids.includes(id));
};

export const getDrawablesOffsets = (
  { x, y }: Position,
  drawables: Drawables[] | null,
) => {
  if (drawables === null) return null;

  return drawables.reduce<Record<string, Position>>((acc, { id, position }) => {
    acc[id] = { x: position.x - x, y: position.y - y };
    return acc;
  }, {});
};
