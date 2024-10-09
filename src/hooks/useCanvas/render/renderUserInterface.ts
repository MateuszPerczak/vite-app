import type { State } from "../useCanvas.types";

export const renderUserInterface = ({ userInterface }: State) => {
  userInterface.drawables.forEach((drawable) =>
    drawable.render({
      showBounds: userInterface.showBounds,
      selected: false,
    }),
  );
};
