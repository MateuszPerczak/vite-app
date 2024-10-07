import type { Drawable } from "@hooks/useCanvas/useCanvas.types";

export type Text = {
  type: "text";
  text: string;
  fontSize: number;
};

export type TextProps = Partial<
  Pick<Drawable<Text>, "position" | "padding" | "text" | "id" | "fontSize">
>;

export type TextDrawable = Drawable<Text>;
