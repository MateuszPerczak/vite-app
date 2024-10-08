import type { Drawable, Drawables, Padding } from "@hooks/useCanvas/useCanvas.types";

export type Box = {
  type: "box";
  children: Drawables[];
  direction: "row" | "column";
  gap: number;
};

export type BoxProps = Partial<
  Pick<Drawable<Box>, "children" | "direction" | "gap"> & {
    padding: Partial<Padding>;
  }
>;

export type BoxDrawable = Drawable<Box>;
