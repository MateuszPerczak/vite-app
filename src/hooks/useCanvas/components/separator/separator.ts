import type { Drawable, OmitDrawableProps } from "@hooks/useCanvas/useCanvas.types";

import type { Separator, SeparatorProps } from "./separator.types";

export const separator = ({ orientation, size }: SeparatorProps): Drawable<Separator> => {
  const drawable: Omit<Drawable<Separator>, OmitDrawableProps> = {
    type: "separator",
    id: "",
    dimensions: { w: 0, h: 0 },
    position: { x: 0, y: 0 },
    padding: { top: 0, left: 0, bottom: 0, right: 0 },
    orientation: orientation || "vertical",
    size: size ?? 10,
  };

  // methods
  const init: Drawable<Separator>["init"] = ({ id, position }) => {
    drawable.id = id;
    if (drawable.orientation === "vertical") {
      drawable.dimensions.h = drawable.size;
      drawable.dimensions.w = 1;
    }
    if (drawable.orientation === "horizontal") {
      drawable.dimensions.h = 1;
      drawable.dimensions.w = drawable.size;
    }
    drawable.position = { ...drawable.position, ...position };
  };

  const move: Drawable<Separator>["move"] = (position, constrain) => {
    const x = Math.min(
      Math.max(position.x, constrain.minX),
      constrain.maxX - drawable.dimensions.w,
    );

    const y = Math.min(
      Math.max(position.y, constrain.minY),
      constrain.maxY - drawable.dimensions.h,
    );

    drawable.position = { x, y };
  };

  const render: Drawable<Separator>["render"] = (context, { showBounds, selected }) => {
    if (drawable.id === "") return;

    context.fillStyle = "#fff";
    context.fillRect(
      drawable.position.x,
      drawable.position.y,
      drawable.dimensions.w,
      drawable.dimensions.h,
    );

    if (selected && !showBounds) {
      context.strokeStyle = "#fff";
      context.setLineDash([4]);
      context.strokeRect(
        drawable.position.x,
        drawable.position.y,
        drawable.dimensions.w,
        drawable.dimensions.h,
      );
      context.setLineDash([0]);
    }

    // bounds
    if (showBounds) {
      context.strokeStyle = selected ? "#fff" : "#4B70F5";
      context.strokeRect(
        drawable.position.x,
        drawable.position.y,
        drawable.dimensions.w,
        drawable.dimensions.h,
      );
      context.beginPath();
      const prevFont = context.font;
      context.font = `bold 8px Arial`;
      const text = `${drawable.type} ${drawable.position.x} ${drawable.position.y}`;

      context.fillStyle = selected ? "#fff" : "#4B70F5";
      const { width } = context.measureText(text);
      context.fillRect(drawable.position.x, drawable.position.y - 10, width + 10, 10);

      context.fillStyle = "#000";
      context.fillText(text, drawable.position.x + 5, drawable.position.y - 2);
      context.closePath();
      context.font = prevFont;
    }
  };
  const update: Drawable<Separator>["update"] = () => {
    ///
  };

  return Object.assign(drawable, { move, render, update, init }) as Drawable<Separator>;
};
