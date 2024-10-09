import type { Drawable, OmitDrawableProps } from "@hooks/useCanvas/useCanvas.types";

import type { Text, TextProps } from "./text.types";

export const text = ({
  text,
  padding,
  fontSize,
  overflow,
}: TextProps): Drawable<Text> => {
  const drawable: Omit<Drawable<Text>, OmitDrawableProps> = {
    type: "text",
    text: text ?? "",
    id: "",
    fontSize: fontSize ?? 12,
    dimensions: { w: 0, h: 0 },
    position: { x: 0, y: 0 },
    padding: { top: 0, left: 0, bottom: 0, right: 0, ...padding },
    offset: { x: 0, y: 0 },
    overflow: overflow ?? false,
    context: null,
  };

  // methods
  const init: Drawable<Text>["init"] = ({ id, position, context }) => {
    drawable.id = id;
    drawable.position = { ...drawable.position, ...position };
    drawable.context = context;
  };

  const move: Drawable<Text>["move"] = (position, constrain) => {
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

  const render: Drawable<Text>["render"] = ({ showBounds, selected }) => {
    if (drawable.id === "") return;
    if (drawable.context === null) return;

    drawable.context.fillStyle = "#fff";
    const prevFont = drawable.context.font;
    drawable.context.font = `${drawable.fontSize}px Arial`;
    const { width: height } = drawable.context.measureText("M");
    const { width } = drawable.context.measureText(drawable.text);

    drawable.offset = { x: 0, y: height };
    drawable.dimensions = {
      w: drawable.padding.left + width + drawable.padding.right,
      h: drawable.padding.top + height + drawable.padding.bottom,
    };

    drawable.context.fillText(
      drawable.text,
      drawable.position.x + drawable.padding.left + drawable.offset.x,
      drawable.position.y + drawable.padding.top + drawable.offset.y,
    );
    drawable.context.font = prevFont;

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
  const update: Drawable<Text>["update"] = ({ fontSize, text }) => {
    void (fontSize && (drawable.fontSize = fontSize));
    void (text !== undefined && (drawable.text = text));
  };

  return Object.assign(drawable, { move, render, update, init }) as Drawable<Text>;
};
