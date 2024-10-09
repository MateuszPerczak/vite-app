import type { BoxDrawable } from "./components/box/box.types";
import type { ImgDrawable } from "./components/image/image.types";
import type { SeparatorDrawable } from "./components/separator/separator.types";
import type { TextDrawable } from "./components/text/text.types";

export type State = {
  mouse: Mouse;
  drawables: Drawables[];
  selectedDrawables: string[] | null;
  drawablesOffsets: Record<string, Position> | null;
  showBounds: boolean;
  userInterface: UserInterface;
  constrain: Constrain;
};

export type UserInterface = {
  drawables: Drawables[];
  showBounds: boolean;
  update: (props: State) => void;
};

export type Mouse = {
  position: Position;
  clickedPos: Position | null;
  isMouseDown: boolean;
  isMouseSelecting: boolean;
  wasMousePointingAtDrawable: boolean;
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
