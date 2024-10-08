import type { Drawable } from "@hooks/useCanvas/useCanvas.types";

export type Separator = {
  type: "separator";
  orientation: "horizontal" | "vertical";
  size: number;
};

export type SeparatorProps = Partial<Pick<Drawable<Separator>, "orientation" | "size">>;

export type SeparatorDrawable = Drawable<Separator>;
