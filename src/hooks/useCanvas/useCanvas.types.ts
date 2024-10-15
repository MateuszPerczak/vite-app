import type { BoxDrawable } from "./components/box/box.types";
import type { ImgDrawable } from "./components/image/image.types";
import type { SeparatorDrawable } from "./components/separator/separator.types";
import type { TextDrawable } from "./components/text/text.types";

export type State = {
  layers: Layer[];
  mouse: Mouse;
  constrain: Constrain;
};

export type Layer = {
  name: string;
  drawables: Drawables[];
  showBounds: boolean;
};

export type Mouse = {
  position: Position;
  clickedPos: Position | null;
  isMouseDown: boolean;
  isMouseSelecting: boolean;
  wasMousePointingAtDrawable: boolean;
  layer: string;
  selection: string[] | null;
};

export type UserInterface = {
  drawables: Drawables[];
  showBounds: boolean;
  update: (props: State) => void;
};

export type Drawables = TextDrawable | BoxDrawable | SeparatorDrawable | ImgDrawable;

export type Drawable<T extends object> = {
  id: string;
  position: Position;
  dimensions: Dimensions;
  padding: Padding;
  context: CanvasRenderingContext2D | null;
  render: (renderProps: DrawableRenderProps) => void;
  move: (position: Position, constrain: Constrain) => void;
  update: (props: Partial<T>) => void;
  init: (props: DrawableInitProps) => void;
} & T;

export type OmitDrawableProps = "move" | "render" | "update" | "init";

export type DrawableRenderProps = {
  showBounds?: boolean;
  selected: boolean;
};

export type DrawableInitProps = {
  id: string;
  position?: Position;
  context: CanvasRenderingContext2D;
};

export type Position = {
  x: number;
  y: number;
};

export type Constrain = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
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
