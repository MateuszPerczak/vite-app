import type { Drawable, OmitDrawableProps } from "@hooks/useCanvas/useCanvas.types";

import type { Box, BoxProps } from "./box.types";

export const box = ({
  padding,
  position,
  children,
  direction,
  gap,
}: BoxProps): Drawable<Box> => {
  const drawable: Omit<Drawable<Box>, OmitDrawableProps> = {
    type: "box",
    id: "",
    dimensions: { w: 0, h: 0 },
    position: position ?? { x: 0, y: 0 },
    padding: padding ?? { top: 0, left: 0, bottom: 0, right: 0 },
    children: children ?? [],
    direction: direction ?? "row",
    gap: gap ?? 0,
  };

  const capitalizedDrawableType = `${drawable.type
    .charAt(0)
    .toUpperCase()}${drawable.type.slice(1)}`;

  // methods
  const init: Drawable<Box>["init"] = ({ id }) => {
    drawable.id = id;
    drawable.children.forEach((child, index) =>
      child.init({ id: `${id}-child-${index}` }),
    );
  };

  const move: Drawable<Box>["move"] = (position, offset) => {
    const x = position.x + (offset?.x ?? 0);
    const y = position.y + (offset?.y ?? 0);
    drawable.position = { x, y };
  };

  const render: Drawable<Box>["render"] = (context, { offset, showBounds, selected }) => {
    if (drawable.id === "") return;

    const position = {
      x: drawable.position.x + offset.x,
      y: drawable.position.y + offset.y,
    };

    // calculate internal children offset
    const childOffset = {
      x: offset.x + drawable.position.x + drawable.padding.left,
      y: offset.y + drawable.position.y + drawable.padding.top,
    };

    // draw children
    let xDraw = childOffset.x;
    let yDraw = childOffset.y;

    const { w, h } = drawable.children.reduce(
      (acc, child, index) => {
        const gap = drawable.children.length - 1 !== index ? drawable.gap : 0;
        if (drawable.direction === "row") {
          child.render(context, {
            offset: { x: xDraw, y: yDraw },
            showBounds,
            selected: false,
          });
          xDraw += child.dimensions.w + gap;
          return {
            w: acc.w + child.dimensions.w + gap,
            h: Math.max(acc.h, child.dimensions.h),
          };
        }
        if (drawable.direction === "column") {
          child.render(context, {
            offset: { x: xDraw, y: yDraw },
            showBounds,
            selected: false,
          });
          yDraw += child.dimensions.h + gap;
          return {
            w: Math.max(acc.w, child.dimensions.w),
            h: acc.h + child.dimensions.h + gap,
          };
        }

        return acc;
      },
      { w: 0, h: 0 },
    );

    drawable.dimensions.w = drawable.padding.left + w + drawable.padding.right;
    drawable.dimensions.h = drawable.padding.top + h + drawable.padding.bottom;

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
  const update: Drawable<Box>["update"] = () => {
    ///
  };

  return Object.assign(drawable, { move, render, update, init }) as Drawable<Box>;
};
