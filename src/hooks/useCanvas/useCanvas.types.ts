import type { BoxDrawable } from "./components/box/box.types";
import type { TextDrawable } from "./components/text/text.types";

export type State = {
  mouse: Mouse;
  drawables: Drawables[];
  selectedDrawables: string[] | null;
  drawablesOffsets: Record<string, Position> | null;
  showBounds: boolean;
  gui: Gui;
};

export type Gui = {
  drawables: Drawables[];
  showBounds: boolean;
};

export type Mouse = {
  position: Position;
  clickedPos: Position | null;
  isMouseDown: boolean;
};

export type Drawables = TextDrawable | BoxDrawable;

export type Drawable<T extends object> = {
  id: string;
  position: Position;
  dimensions: Dimensions;
  padding: Padding;
  render: (context: CanvasRenderingContext2D, renderProps: DrawableRenderProps) => void;
  move: (position: Position, offset?: Position) => void;
  update: (props: Pick<Drawable<T>, "dimensions" | "padding" | "position"> & T) => void;
  init: (props: DrawableInitProps) => void;
} & T;

export type OmitDrawableProps = "move" | "render" | "update" | "init";

export type DrawableRenderProps = {
  offset: Position;
  showBounds?: boolean;
  selected: boolean;
};

export type DrawableInitProps = {
  id: string;
};

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
