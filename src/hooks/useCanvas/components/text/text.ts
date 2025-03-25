import type { Drawable } from "@hooks/useCanvas/useCanvas.types";

import type { Text, TextProps } from "./text.types";

export const text = ({
  id,
  text,
  position,
  padding,
  fontSize,
}: TextProps): Drawable<Text> => {
  const drawable: Omit<Drawable<Text>, "move" | "render" | "update"> = {
    type: "text",
    text: text ?? "",
    id: id ?? "",
    fontSize: fontSize ?? 12,
    dimensions: { w: 0, h: 0 },
    position: position ?? { x: 0, y: 0 },
    padding: padding ?? { top: 0, left: 0, bottom: 0, right: 0 },
  };

  const capitalizedDrawableType = `${drawable.type
    .charAt(0)
    .toUpperCase()}${drawable.type.slice(1)}`;

  const move: Drawable<Text>["move"] = (position) => {
    drawable.position = position;
  };

  const render: Drawable<Text>["render"] = (context, offset, showBounds) => {
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

  return {
    ...drawable,
    move,
    render,
    update,
  };
};
