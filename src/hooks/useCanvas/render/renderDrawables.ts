import type { State } from "../useCanvas.types";

export const renderDrawables = ({ drawables, selectedDrawables, showBounds }: State) => {
  drawables.forEach((drawable) =>
    drawable.render({
      showBounds,
      selected: selectedDrawables?.includes(drawable.id) ?? false,
    }),
  );
};
