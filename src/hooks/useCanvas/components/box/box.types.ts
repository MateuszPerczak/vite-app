import type { Drawable, Drawables } from "@hooks/useCanvas/useCanvas.types";

export type Box = {
  type: "box";
  children: Drawables[];
  direction: "row" | "column";
  gap: number;
};

export type BoxProps = Partial<
  Pick<Drawable<Box>, "position" | "padding" | "id" | "children" | "direction" | "gap">
>;

export type BoxDrawable = Drawable<Box>;
