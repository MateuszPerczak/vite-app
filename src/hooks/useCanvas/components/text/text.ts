import type { Drawable, OmitDrawableProps } from "@hooks/useCanvas/useCanvas.types";

import type { Text, TextProps } from "./text.types";

export const text = ({
  text,
  position,
  padding,
  fontSize,
}: TextProps): Drawable<Text> => {
  const drawable: Omit<Drawable<Text>, OmitDrawableProps> = {
    type: "text",
    text: text ?? "",
    id: "",
    fontSize: fontSize ?? 12,
    dimensions: { w: 0, h: 0 },
    position: position ?? { x: 0, y: 0 },
    padding: padding ?? { top: 0, left: 0, bottom: 0, right: 0 },
  };

  const capitalizedDrawableType = `${drawable.type
    .charAt(0)
    .toUpperCase()}${drawable.type.slice(1)}`;

  // methods
  const init: Drawable<Text>["init"] = ({ id }) => {
    drawable.id = id;
  };

  const move: Drawable<Text>["move"] = (position, offset) => {
    const x = (offset?.x ?? 0) + position.x;
    const y = (offset?.y ?? 0) + position.y;
    drawable.position = { x, y };
  };

  const render: Drawable<Text>["render"] = (
    context,
    { offset, showBounds, selected },
  ) => {
    if (drawable.id === "") return;
    const position = {
      x: drawable.position.x + offset.x,
      y: drawable.position.y + offset.y,
    };

    context.fillStyle = "#fff";
    const prevFont = context.font;
    context.font = `${drawable.fontSize}px Arial`;
    const { width: height } = context.measureText("M");
    const { width } = context.measureText(drawable.text);

    drawable.dimensions.w = drawable.padding.left + width + drawable.padding.right;
    drawable.dimensions.h = drawable.padding.top + height + drawable.padding.bottom;

    context.fillText(
      drawable.text,
      position.x + drawable.padding.left,
      position.y + drawable.padding.top + height,
    );
    context.font = prevFont;

    if (selected) {
      context.strokeStyle = "#fff";
      context.setLineDash([4]);
      context.strokeRect(
        position.x,
        position.y,
        drawable.dimensions.w,
        drawable.dimensions.h,
      );
      context.setLineDash([0]);
    }

    // bounds
    if (showBounds) {
      context.strokeStyle = "#ff00cc";
      context.strokeRect(
        position.x,
        position.y,
        drawable.dimensions.w,
        drawable.dimensions.h,
      );
      const prevFont = context.font;
      context.font = `bold 10px sans-serif`;
      context.fillStyle = "#ff00cc";
      context.fillText(`${capitalizedDrawableType}`, position.x, position.y - 5);
      context.font = prevFont;
    }
  };
  const update: Drawable<Text>["update"] = () => {
    ///
  };

  return Object.assign(drawable, { move, render, update, init }) as Drawable<Text>;
};
