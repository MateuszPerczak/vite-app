import { useEffect, useRef, useState } from "react";

import { box, text } from "./components";
import {
  getDrawablesFromId,
  getDrawablesFromPointing,
  getDrawablesIds,
  getDrawablesOffsets,
} from "./helpers";
import { renderDrawables, renderGui, renderSelection, renderStats } from "./render";
import type { Drawables, Mouse, Position, State } from "./useCanvas.types";

export const useCanvas = () => {
  const [state, setState] = useState<State>({
    drawables: [],
    drawablesOffsets: {},
    gui: {
      drawables: [],
      showBounds: true,
    },
    mouse: {
      position: { x: 0, y: 0 },
      clickedPos: null,
      isMouseDown: false,
    },
    selectedDrawables: null,
    showBounds: false,
  });

  // helper functions

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getId = (length: number) => {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters[randomIndex];
    }
    return id;
  };

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

  // mouse
  const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
    if (canvasRef.current === null) return;

    const { top, left, height, width } = canvasRef.current.getBoundingClientRect();

    const x = Math.min(Math.max(clientX - left, 0), width);
    const y = Math.min(Math.max(clientY - top, 0), height);
    setState((prevState) => {
      const mouse: Mouse = { ...prevState.mouse, position: { x, y } };

      const drawables = getDrawablesFromId(
        prevState.drawables,
        prevState.selectedDrawables,
      );

      void (
        mouse.isMouseDown &&
        drawables?.forEach((drawable) =>
          drawable.move(mouse.position, prevState.drawablesOffsets?.[drawable.id]),
        )
      );

      const newState = {
        ...prevState,
        mouse,
      };

      render(newState);
      return newState;
    });
  };

  const handleMouseDown = ({ clientX, clientY }: MouseEvent) => {
    if (canvasRef.current === null) return;

    const { top, left, height, width } = canvasRef.current.getBoundingClientRect();

    const x = Math.min(Math.max(clientX - left, 0), width);
    const y = Math.min(Math.max(clientY - top, 0), height);
    setState((prevState) => {
      const mouse: Mouse = {
        ...prevState.mouse,
        position: { x, y },
        clickedPos: { x, y },
        isMouseDown: true,
      };
      const selectedDrawables = getDrawablesFromPointing(
        mouse.position,
        prevState.drawables,
      );

      const drawablesOffsets = getDrawablesOffsets(mouse.position, selectedDrawables);

      const newState: State = {
        ...prevState,
        mouse,
        selectedDrawables: getDrawablesIds(selectedDrawables),
        drawablesOffsets,
      };
      render(newState);
      return newState;
    });
  };

  const handleMouseUp = ({ clientX, clientY }: MouseEvent) => {
    if (canvasRef.current === null) return;

    const { top, left, height, width } = canvasRef.current.getBoundingClientRect();

    const x = Math.min(Math.max(clientX - left, 0), width);
    const y = Math.min(Math.max(clientY - top, 0), height);
    setState((prevState) => {
      const newState: State = {
        ...prevState,
        drawablesOffsets: null,
        mouse: {
          ...prevState.mouse,
          position: { x, y },
          clickedPos: null,
          isMouseDown: false,
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
    renderStats(context, _state);
    renderDrawables(context, _state);
    renderGui(context, _state);
  };

  const init = () => {
    const drawables: Drawables[] = [
      box({
        position: { x: 150, y: 210 },
        padding: { top: 10, left: 10, right: 10, bottom: 10 },
        direction: "column",
        gap: 5,
        children: [
          text({
            text: "Sperma to eksportowy towar",
            position: { x: 0, y: 0 },
            fontSize: 15,
          }),
          text({
            text: "Siura wyciągam z kieszeni",
            position: { x: 0, y: 0 },
            fontSize: 10,
          }),
        ],
      }),
      text({
        text: "Hahaha it was a bad idea",
        position: { x: 100, y: 50 },
        fontSize: 10,
        padding: { top: 10, left: 10, right: 10, bottom: 10 },
      }),
    ];

    setState((prevState) => {
      const newState = {
        ...prevState,
        drawables: drawables.map((drawable) => {
          drawable.init({ id: getId(10) });
          return drawable;
        }),
      };
      render(newState);
      return newState;
    });
  };

  useEffect(() => {
    const cleanup: ((() => void) | void)[] = [initMouse(), init()];

    return (): void => cleanup.forEach((clean) => clean && clean());
  }, []);

  return [canvasRef, {}] as const;
};
