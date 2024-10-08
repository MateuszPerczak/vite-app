import type { Drawable } from "@hooks/useCanvas/useCanvas.types";

export type Img = {
  src: string;
  type: "img";
  image: HTMLImageElement;
  width?: number;
  height?: number;
};

export type ImgProps = Partial<
  Pick<Drawable<Img>, "padding" | "src" | "width" | "height">
>;

export type ImgDrawable = Drawable<Img>;
