import { useEffect, useRef, useState } from "react";

import { box, text } from "./components";
import { renderMouse, renderSelection } from "./render";
import type { State } from "./useCanvas.types";

export const useCanvas = () => {
  const [state, setState] = useState<State>({
    drawables: [],
    mouse: {
      position: { x: 0, y: 0 },
      clickedPos: null,
    },
    selectedDrawablesId: null,
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
      const newState = {
        ...prevState,
        mouse: { ...prevState.mouse, position: { x, y } },
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
      const newState = {
        ...prevState,
        mouse: { ...prevState.mouse, position: { x, y }, clickedPos: { x, y } },
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
        mouse: { ...prevState.mouse, position: { x, y }, clickedPos: null },
        selectedDrawablesId: null,
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
    // clear canvas

    const mouse = (targetState ?? state).mouse;
    const drawables = (targetState ?? state).drawables;

    context.clearRect(0, 0, canvas.width, canvas.height);
    renderSelection(context, targetState ?? state);
    renderMouse(context, mouse);
    drawables.forEach((drawable) => drawable.render(context, { x: 0, y: 0 }, true));
  };

  const init = () => {
    setState((prevState) => {
      const newState = {
        ...prevState,
        drawables: [
          box({
            id: getId(10),
            position: { x: 150, y: 210 },
            padding: { top: 10, left: 10, right: 10, bottom: 10 },
            direction: "column",
            gap: 5,
            children: [
              text({
                id: getId(10),
                text: "Hahaha it was a bad idea",
                position: { x: 0, y: 0 },
                fontSize: 10,
              }),
            ],
          }),
          text({
            id: getId(10),
            text: "Hahaha it was a bad idea",
            position: { x: 100, y: 50 },
            fontSize: 10,
            padding: { top: 10, left: 10, right: 10, bottom: 10 },
          }),
        ],
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
