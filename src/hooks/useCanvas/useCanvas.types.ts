import type { BoxDrawable } from "./components/box/box.types";
import type { TextDrawable } from "./components/text/text.types";

export type State = {
  mouse: Mouse;
  drawables: Drawables[];
  selectedDrawablesId: string[] | null;
};

export type Mouse = {
  position: Position;
  clickedPos: Position | null;
};

export type Drawables = TextDrawable | BoxDrawable;

export type Drawable<T extends object> = {
  id: string;
  position: Position;
  dimensions: Dimensions;
  padding: Padding;
  render: (
    context: CanvasRenderingContext2D,
    offset: Position,
    showBounds?: boolean,
  ) => void;
  move: (position: Position) => void;
  update: (props: Pick<Drawable<T>, "dimensions" | "padding" | "position"> & T) => void;
} & T;

export type Position = {
  x: number;
  y: number;
};

export type Dimensions = {
  w: number;
  h: number;
};

export type Padding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};
