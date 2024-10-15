import type { State } from "../useCanvas.types";

export const renderLayers = ({ layers }: State) => {
  const preRenderTime = performance.now();

  layers.forEach(({ drawables, showBounds }) => {
    drawables.forEach((drawable) => drawable.render({ selected: false, showBounds }));
  });

  return performance.now() - preRenderTime;
};
