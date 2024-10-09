import type { Drawable, OmitDrawableProps } from "@hooks/useCanvas/useCanvas.types";

import type { Img, ImgProps } from "./image.types";

export const image = ({ src, padding, width, height }: ImgProps): Drawable<Img> => {
  const drawable: Omit<Drawable<Img>, OmitDrawableProps> = {
    type: "img",
    id: "",
    dimensions: { w: 0, h: 0 },
    position: { x: 0, y: 0 },
    padding: { top: 0, left: 0, bottom: 0, right: 0, ...padding },
    src: src ?? "",
    image: new Image(),
    height,
    width,
    context: null,
  };

  // methods
  const init: Drawable<Img>["init"] = ({ id, position, context }) => {
    drawable.id = id;
    drawable.position = { ...drawable.position, ...position };
    drawable.image.src = drawable.src;
    drawable.context = context;

    drawable.image.onload = () => {
      let width = 0;
      let height = 0;

      if (drawable.width !== undefined) {
        width = drawable.width;
        height =
          drawable.width * (drawable.image.naturalHeight / drawable.image.naturalWidth);
      }
      if (drawable.height !== undefined) {
        width =
          drawable.height * (drawable.image.naturalWidth / drawable.image.naturalHeight);
        height = drawable.height;
      }

      drawable.dimensions = {
        w: drawable.padding.left + width + drawable.padding.right,
        h: drawable.padding.top + height + drawable.padding.bottom,
      };
      drawable.width = width;
      drawable.height = height;
    };
  };

  const move: Drawable<Img>["move"] = (position, constrain) => {
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

  const render: Drawable<Img>["render"] = ({ showBounds, selected }) => {
    if (drawable.id === "") return;
    if (drawable.context === null) return;

    drawable.context.drawImage(
      drawable.image,
      drawable.position.x,
      drawable.position.y,
      drawable.width ?? 0,
      drawable.height ?? 0,
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
  const update: Drawable<Img>["update"] = () => {
    ///
  };

  return Object.assign(drawable, { move, render, update, init }) as Drawable<Img>;
};
