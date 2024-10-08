import type { Drawable, Padding, Position } from "@hooks/useCanvas/useCanvas.types";

export type Text = {
  type: "text";
  text: string;
  fontSize: number;
  offset: Position;
  overflow: boolean;
};

export type TextProps = Partial<
  Pick<Drawable<Text>, "text" | "fontSize" | "overflow"> & { padding: Partial<Padding> }
>;

export type TextDrawable = Drawable<Text>;
