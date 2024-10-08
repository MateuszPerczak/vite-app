import type { State } from "../useCanvas.types";

export const renderUserInterface = (
  context: CanvasRenderingContext2D,
  { userInterface, constrain }: State,
) => {
  userInterface.drawables.forEach((drawable) =>
    drawable.render(context, {
      showBounds: userInterface.showBounds,
      selected: false,
      constrain,
    }),
  );
};
