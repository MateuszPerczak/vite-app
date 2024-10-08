import type { Drawable, OmitDrawableProps } from "@hooks/useCanvas/useCanvas.types";

import type { Box, BoxProps } from "./box.types";

export const box = ({ padding, children, direction, gap }: BoxProps): Drawable<Box> => {
  const drawable: Omit<Drawable<Box>, OmitDrawableProps> = {
    type: "box",
    id: "",
    dimensions: { w: 0, h: 0 },
    position: { x: 0, y: 0 },
    padding: { top: 0, left: 0, bottom: 0, right: 0, ...padding },
    children: children ?? [],
    direction: direction ?? "row",
    gap: gap ?? 0,
  };

  // methods
  const init: Drawable<Box>["init"] = ({ id, position }) => {
    drawable.id = id;
    drawable.position = { ...drawable.position, ...position };
    // init children
    drawable.children.forEach((child, index) =>
      child.init({
        id: `${id}-child-${index}`,
        position: {
          x: drawable.position.x + drawable.padding.left,
          y: drawable.position.y + drawable.padding.top,
        },
      }),
    );
  };

  const move: Drawable<Box>["move"] = (position, constrain) => {
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

  const render: Drawable<Box>["render"] = (
    context,
    { showBounds, selected, constrain },
  ) => {
    if (drawable.id === "") return;

    const { w, h } = drawable.children.reduce(
      (acc, child, index) => {
        child.move({ x: acc.x, y: acc.y }, constrain);
        const gap = drawable.children.length - 1 !== index ? drawable.gap : 0;
        if (drawable.direction === "column") {
          acc.h += child.dimensions.h + gap;
          acc.w = Math.max(acc.w, child.dimensions.w);
          acc.y += child.dimensions.h + gap;
        }
        if (drawable.direction === "row") {
          acc.x += child.dimensions.w + gap;
          acc.h = Math.max(acc.h, child.dimensions.h);
          acc.w += child.dimensions.w + gap;
        }
        return acc;
      },
      {
        x: drawable.position.x + drawable.padding.left,
        y: drawable.position.y + drawable.padding.top,
        w: 0,
        h: 0,
      },
    );

    // update drawable dimensions
    drawable.dimensions = {
      w: drawable.padding.left + w + drawable.padding.right,
      h: drawable.padding.top + h + drawable.padding.bottom,
    };

    drawable.children.forEach((child) =>
      child.render(context, {
        showBounds: false,
        selected: false,
        constrain: {
          minX: drawable.position.x,
          minY: drawable.position.y,
          maxX: drawable.dimensions.w,
          maxY: drawable.dimensions.h,
        },
      }),
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
  const update: Drawable<Box>["update"] = () => {
    ///
  };

  return Object.assign(drawable, { move, render, update, init }) as Drawable<Box>;
};
