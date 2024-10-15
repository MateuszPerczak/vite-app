import { useEffect, useRef, useState } from "react";

import { box, image, separator, text } from "./components";
import {
  getDrawablesFromPosition,
  getDrawablesIds,
  getId,
  getMousePosition,
} from "./helpers";
import { crateUserInterface } from "./interface";
import { renderLayers, renderSelection } from "./render";
import type { Drawables, Layer, Mouse, Position, State } from "./useCanvas.types";

export const useCanvas = () => {
  const [state, setState] = useState<State>({
    layers: [
      {
        name: "main",
        drawables: [
          box({
            padding: { top: 10, left: 10, right: 10, bottom: 10 },
            direction: "column",
            gap: 5,
            children: [
              text({
                text: "Sperma to eksportowy towar",
                fontSize: 15,
              }),
              text({
                text: "Siura wyciągam z kieszeni",
                fontSize: 10,
              }),
            ],
          }),
        ],
        showBounds: true,
      },
    ],
    mouse: {
      position: { x: 0, y: 0 },
      clickedPos: null,
      isMouseDown: false,
      isMouseSelecting: false,
      wasMousePointingAtDrawable: false,
      layer: "main",
      selection: null,
    },
    constrain: {
      minX: 0,
      minY: 0,
      maxX: 800,
      maxY: 600,
    },
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // helper functions

  const initMouse = () => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    if (canvasRef.current === null) return;
    canvasRef.current.addEventListener("mousedown", handleMouseDown);
    // cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      if (canvasRef.current === null) return;
      canvasRef.current.removeEventListener("mousedown", handleMouseDown);
    };
  };

  // const initDrawables = () => {
  //   if (canvasRef.current === null) return;
  //   const canvas = canvasRef.current;

  //   const context = canvas.getContext("2d");
  //   if (context === null) return;
  //   setState((prevState) => {
  //     const newState: State = {
  //       ...prevState,
  //       drawables: [
  //         box({
  //           padding: { top: 10, left: 10, right: 10, bottom: 10 },
  //           direction: "column",
  //           gap: 5,
  //           children: [
  //             text({
  //               text: "Sperma to eksportowy towar",
  //               fontSize: 15,
  //             }),
  //             text({
  //               text: "Siura wyciągam z kieszeni",
  //               fontSize: 10,
  //             }),
  //           ],
  //         }),
  //       ],
  //     };

  //     newState.drawables.forEach((drawable, index) =>
  //       drawable.init({
  //         id: getId(10),
  //         position: { x: 20 * (index + 1), y: 20 * (index + 1) },
  //         context,
  //       }),
  //     );
  //     render(newState);
  //     return newState;
  //   });
  // };

  // const initUserInterface = () => {
  //   if (canvasRef.current === null) return;
  //   const canvas = canvasRef.current;

  //   const context = canvas.getContext("2d");
  //   if (context === null) return;

  //   const { layout, update } = crateUserInterface();

  //   setState((prevState) => {
  //     const newState: State = {
  //       ...prevState,
  //       userInterface: { ...prevState.userInterface, drawables: layout, update },
  //     };

  //     const position: Position = { x: 0, y: 0 };

  //     newState.userInterface.drawables.forEach((drawable) =>
  //       drawable.init({ id: getId(10), position, context }),
  //     );
  //     render(newState);
  //     return newState;
  //   });
  // };

  // layer functions

  const getLayer = (targetState: State, targetName: string) => {
    const match = targetState.layers.find(({ name }) => name === targetName);
    if (match === undefined) {
      console.error(`layer "${targetName}" doesn't exist!`);
      return;
    }
    return match;
  };

  const createLayer = (targetState: State, layer: Layer): State => {
    const layerNames = targetState.layers.map(({ name }) => name);
    if (layerNames.includes(layer.name)) {
      console.error(`name "${layer.name}" is already in use, try using different name.`);
      return targetState;
    }

    return {
      ...targetState,
      layers: [...targetState.layers, layer],
    };
  };

  const initLayer = (
    targetState: State,
    targetName: string,
    position?: Position,
  ): void => {
    if (canvasRef.current === null) {
      console.error(`cannot get canvas reference.`);
      return;
    }
    const context = canvasRef.current.getContext("2d");
    if (context === null) {
      console.error(`cannot get canvas context.`);
      return;
    }
    const layer = getLayer(targetState, targetName);
    if (layer === undefined) {
      return;
    }
    layer.drawables.forEach((drawable) =>
      drawable.init({
        id: getId(20),
        context,
        position: position ?? { x: 0, y: 0 },
      }),
    );
  };

  const appendDrawableToLayer = (
    targetState: State,
    targetName: string,
    drawable: Drawables,
    position?: Position,
  ): State => {
    if (canvasRef.current === null) {
      console.error(`cannot get canvas reference.`);
      return targetState;
    }
    const context = canvasRef.current.getContext("2d");
    if (context === null) {
      console.error(`cannot get canvas context.`);
      return targetState;
    }
    const layer = getLayer(targetState, targetName);
    if (layer === undefined) {
      return targetState;
    }
    layer.drawables.push(drawable);

    drawable.init({
      id: getId(20),
      context,
      position: position ?? { x: 0, y: 0 },
    });

    return targetState;
  };

  // mouse
  const handleMouseMove = (event: MouseEvent) => {
    if (canvasRef.current === null) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();

    const { x, y } = getMousePosition(event, canvasRect);
    setState((prevState) => {
      const mouse: Mouse = {
        ...prevState.mouse,
        position: { x, y },
        isMouseSelecting:
          prevState.mouse.isMouseDown && !prevState.mouse.wasMousePointingAtDrawable,
      };

      // // move drawables
      // if (mouse.isMouseDown && !mouse.isMouseSelecting) {
      //   const drawables = getDrawablesFromId(
      //     prevState.drawables,
      //     prevState.selectedDrawables,
      //   );
      //   void (
      //     drawables !== null &&
      //     drawables.forEach((drawable) => {
      //       const position: Position = getDrawablePositionFromOffset(
      //         mouse.position,
      //         prevState.drawablesOffsets?.[drawable.id],
      //       );

      //       drawable.move(position, prevState.constrain);
      //     })
      //   );
      // }
      // let selectedDrawables = prevState.selectedDrawables;
      // if (mouse.isMouseSelecting) {
      //   selectedDrawables = getDrawablesIds(
      //     getDrawablesFromSelecting(mouse, prevState.drawables),
      //   );
      // }

      const newState: State = {
        ...prevState,
        // selectedDrawables,
        mouse,
      };
      render(newState);
      return newState;
    });
  };

  const handleMouseDown = (event: MouseEvent) => {
    if (canvasRef.current === null) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();

    const { x, y } = getMousePosition(event, canvasRect);

    setState((prevState) => {
      const mouse: Mouse = {
        ...prevState.mouse,
        position: { x, y },
        clickedPos: { x, y },
        isMouseDown: true,
      };

      const layer = getLayer(prevState, "main");

      if (layer === undefined) {
        return { ...prevState, mouse };
      }

      const drawables = getDrawablesFromPosition(layer, mouse.position);

      mouse.selection = getDrawablesIds(drawables);

      const newState: State = {
        ...prevState,
        mouse,
      };
      render(newState);
      return newState;

      // let selectedDrawables = getDrawablesFromPointing(
      //   mouse.position,
      //   prevState.drawables,
      // );

      // if (event.ctrlKey) {
      //   selectedDrawables = mergeDrawables(
      //     selectedDrawables,
      //     getDrawablesFromId(prevState.drawables, prevState.selectedDrawables),
      //   );
      // }
      // if (selectedDrawables !== null && selectedDrawables.length > 1 && !event.ctrlKey) {
      //   const prevSelectedDrawable = (prevState.selectedDrawables ?? [])[0] ?? null;
      //   if (prevSelectedDrawable !== null) {
      //     const index = getDrawablesIds(selectedDrawables)!.indexOf(prevSelectedDrawable);

      //     const l =
      //       selectedDrawables[
      //         (((index + 1) % selectedDrawables.length) + selectedDrawables.length) %
      //           selectedDrawables.length
      //       ];
      //     if (l !== undefined) {
      //       selectedDrawables = [l];
      //     }
      //   } else {
      //     selectedDrawables =
      //       selectedDrawables[0] !== undefined ? [selectedDrawables[0]] : null;
      //   }
      // }

      // mouse.wasMousePointingAtDrawable = selectedDrawables !== null;

      // let drawablesOffsets = null;
      // if (selectedDrawables !== null) {
      //   drawablesOffsets = getDrawablesOffsets(mouse, selectedDrawables);
      // }

      // const newState: State = {
      //   ...prevState,
      //   mouse,
      //   // drawablesOffsets,
      //   // selectedDrawables: getDrawablesIds(selectedDrawables),
      // };
      // render(newState);
      // return newState;
    });
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (canvasRef.current === null) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();

    const { x, y } = getMousePosition(event, canvasRect);
    setState((prevState) => {
      const newState: State = {
        ...prevState,
        mouse: {
          ...prevState.mouse,
          position: { x, y },
          clickedPos: null,
          isMouseDown: false,
          isMouseSelecting: false,
          wasMousePointingAtDrawable: false,
        },
      };
      render(newState);
      return newState;
    });
  };

  // render

  const render = (targetState?: State) => {
    if (canvasRef.current === null) return;
    const canvas = canvasRef.current;

    const context = canvas.getContext("2d");
    if (context === null) return;
    const _state: State = targetState ?? state;
    // clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    renderSelection(context, _state);
    renderLayers(_state);
  };

  const init = () => {
    setState((prevState) => {
      initLayer(prevState, "main", { x: 100, y: 200 });

      render(prevState);
      return prevState;
    });
  };

  useEffect(() => {
    const cleanup: ((() => void) | void)[] = [initMouse(), init()];

    return (): void => cleanup.forEach((clean) => clean && clean());
  }, []);

  return [canvasRef, {}] as const;
};
