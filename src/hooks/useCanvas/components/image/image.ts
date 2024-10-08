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
  };

  // methods
  const init: Drawable<Img>["init"] = ({ id, position }) => {
    drawable.id = id;
    drawable.position = { ...drawable.position, ...position };
    drawable.image.src = drawable.src;

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

  const render: Drawable<Img>["render"] = (context, { showBounds, selected }) => {
    if (drawable.id === "") return;

    context.drawImage(
      drawable.image,
      drawable.position.x,
      drawable.position.y,
      drawable.width ?? 0,
      drawable.height ?? 0,
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
  const update: Drawable<Img>["update"] = () => {
    ///
  };

  return Object.assign(drawable, { move, render, update, init }) as Drawable<Img>;
};
