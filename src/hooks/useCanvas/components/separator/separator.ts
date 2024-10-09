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
    context: null,
  };

  // methods
  const init: Drawable<Separator>["init"] = ({ id, position, context }) => {
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
    drawable.context = context;
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

  const render: Drawable<Separator>["render"] = ({ showBounds, selected }) => {
    if (drawable.id === "") return;
    if (drawable.context === null) return;

    drawable.context.fillStyle = "#fff";
    drawable.context.fillRect(
      drawable.position.x,
      drawable.position.y,
      drawable.dimensions.w,
      drawable.dimensions.h,
    );

    if (selected && !showBounds) {
      drawable.context.strokeStyle = "#fff";
      drawable.context.setLineDash([4]);
      drawable.context.strokeRect(
        drawable.position.x,
        drawable.position.y,
        drawable.dimensions.w,
        drawable.dimensions.h,
      );
      drawable.context.setLineDash([0]);
    }

    // bounds
    if (showBounds) {
      drawable.context.strokeStyle = selected ? "#fff" : "#4B70F5";
      drawable.context.strokeRect(
        drawable.position.x,
        drawable.position.y,
        drawable.dimensions.w,
        drawable.dimensions.h,
      );
      drawable.context.beginPath();
      const prevFont = drawable.context.font;
      drawable.context.font = `bold 8px Arial`;
      const text = `${drawable.type} ${drawable.position.x} ${drawable.position.y}`;

      drawable.context.fillStyle = selected ? "#fff" : "#4B70F5";
      const { width } = drawable.context.measureText(text);
      drawable.context.fillRect(
        drawable.position.x,
        drawable.position.y - 10,
        width + 10,
        10,
      );

      drawable.context.fillStyle = "#000";
      drawable.context.fillText(text, drawable.position.x + 5, drawable.position.y - 2);
      drawable.context.closePath();
      drawable.context.font = prevFont;
    }
  };
  const update: Drawable<Separator>["update"] = () => {
    ///
  };

  return Object.assign(drawable, { move, render, update, init }) as Drawable<Separator>;
};
