import { useEffect, useRef, useState } from "react";

import { box, image, separator, text } from "./components";
import {
  getDrawablePositionFromOffset,
  getDrawablesFromId,
  getDrawablesFromPointing,
  getDrawablesFromSelecting,
  getDrawablesIds,
  getDrawablesOffsets,
  mergeDrawables,
} from "./helpers";
import { crateUserInterface } from "./interface";
import { renderDrawables, renderSelection, renderUserInterface } from "./render";
import type { Mouse, Position, State } from "./useCanvas.types";

export const useCanvas = () => {
  const [state, setState] = useState<State>({
    drawables: [],
    drawablesOffsets: {},
    userInterface: {
      drawables: [],
      showBounds: false,
      update: () => undefined,
    },
    mouse: {
      position: { x: 0, y: 0 },
      clickedPos: null,
      isMouseDown: false,
      isMouseSelecting: false,
      wasMousePointingAtDrawable: false,
    },
    selectedDrawables: null,
    showBounds: true,
    constrain: {
      minX: 0,
      minY: 0,
      maxX: 1500,
      maxY: 900,
    },
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

  const initDrawables = () => {
    if (canvasRef.current === null) return;
    const canvas = canvasRef.current;

    const context = canvas.getContext("2d");
    if (context === null) return;
    setState((prevState) => {
      const newState: State = {
        ...prevState,
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
          text({
            text: "Sperma to eksportowy towar",
            fontSize: 15,
          }),
          text({
            text: "Siura wyciągam z kieszeni",
            fontSize: 10,
          }),
          separator({ size: 100, orientation: "horizontal" }),

          box({
            padding: { top: 10, left: 10, right: 10, bottom: 10 },
            direction: "column",
            gap: 5,
            children: [
              image({
                src: "https://oursaferschools.co.uk/wp-content/uploads/2021/09/Featured-Post.jpg",
                width: 300,
              }),
              text({
                text: "Furasy jebane",
                fontSize: 15,
              }),
            ],
          }),

          box({
            padding: { top: 10, left: 10, right: 10, bottom: 10 },
            direction: "column",
            gap: 5,
            children: [
              image({
                src: "https://pbs.twimg.com/media/GV_R11caoAMS72f?format=jpg",
                width: 300,
              }),
              separator({ size: 300, orientation: "horizontal" }),
              text({
                text: "Well shit",
                fontSize: 15,
              }),
            ],
          }),
          image({
            src: "https://pbs.twimg.com/media/GR0QnDQWcAAwhc1?format=jpg",
            width: 500,
          }),
        ],
      };

      newState.drawables.forEach((drawable, index) =>
        drawable.init({
          id: getId(10),
          position: { x: 20 * (index + 1), y: 20 * (index + 1) },
        }),
      );
      render(newState);
      return newState;
    });
  };

  const initUserInterface = () => {
    if (canvasRef.current === null) return;
    const canvas = canvasRef.current;

    const context = canvas.getContext("2d");
    if (context === null) return;

    const { layout, update } = crateUserInterface();

    setState((prevState) => {
      const newState: State = {
        ...prevState,
        userInterface: { ...prevState.userInterface, drawables: layout, update },
      };

      newState.userInterface.drawables.forEach((drawable) =>
        drawable.init({ id: getId(10) }),
      );
      render(newState);
      return newState;
    });
  };

  // mouse
  const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
    if (canvasRef.current === null) return;

    const { top, left, height, width } = canvasRef.current.getBoundingClientRect();

    const x = Math.min(Math.max(clientX - left, 0), width);
    const y = Math.min(Math.max(clientY - top, 0), height);
    setState((prevState) => {
      const mouse: Mouse = {
        ...prevState.mouse,
        position: { x, y },
        isMouseSelecting:
          prevState.mouse.isMouseDown && !prevState.mouse.wasMousePointingAtDrawable,
      };

      // move drawables
      if (mouse.isMouseDown && !mouse.isMouseSelecting) {
        const drawables = getDrawablesFromId(
          prevState.drawables,
          prevState.selectedDrawables,
        );
        void (
          drawables !== null &&
          drawables.forEach((drawable) => {
            const position: Position = getDrawablePositionFromOffset(
              mouse.position,
              prevState.drawablesOffsets?.[drawable.id],
            );

            drawable.move(position, prevState.constrain);
          })
        );
      }
      let selectedDrawables = prevState.selectedDrawables;
      if (mouse.isMouseSelecting) {
        selectedDrawables = getDrawablesIds(
          getDrawablesFromSelecting(mouse, prevState.drawables),
        );
      }

      const newState: State = {
        ...prevState,
        selectedDrawables,
        mouse,
      };
      prevState.userInterface.update(newState);
      render(newState);
      return newState;
    });
  };

  const handleMouseDown = ({ clientX, clientY, ctrlKey }: MouseEvent) => {
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
      let selectedDrawables = getDrawablesFromPointing(
        mouse.position,
        prevState.drawables,
      );

      if (ctrlKey) {
        selectedDrawables = mergeDrawables(
          selectedDrawables,
          getDrawablesFromId(prevState.drawables, prevState.selectedDrawables),
        );
      }
      if (selectedDrawables !== null && selectedDrawables.length > 1 && !ctrlKey) {
        const prevSelectedDrawable = (prevState.selectedDrawables ?? [])[0] ?? null;
        if (prevSelectedDrawable !== null) {
          const index = getDrawablesIds(selectedDrawables)!.indexOf(prevSelectedDrawable);

          const l =
            selectedDrawables[
              (((index + 1) % selectedDrawables.length) + selectedDrawables.length) %
                selectedDrawables.length
            ];
          if (l !== undefined) {
            selectedDrawables = [l];
          }
        } else {
          selectedDrawables =
            selectedDrawables[0] !== undefined ? [selectedDrawables[0]] : null;
        }
      }

      mouse.wasMousePointingAtDrawable = selectedDrawables !== null;

      let drawablesOffsets = null;
      if (selectedDrawables !== null) {
        drawablesOffsets = getDrawablesOffsets(mouse, selectedDrawables);
      }

      const newState: State = {
        ...prevState,
        mouse,
        drawablesOffsets,
        selectedDrawables: getDrawablesIds(selectedDrawables),
      };
      prevState.userInterface.update(newState);
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
          isMouseSelecting: false,
          wasMousePointingAtDrawable: false,
        },
      };
      prevState.userInterface.update(newState);
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
    renderDrawables(context, _state);
    renderUserInterface(context, _state);
  };

  const init = () => {
    setState((prevState) => {
      render(prevState);
      return prevState;
    });
  };

  useEffect(() => {
    const cleanup: ((() => void) | void)[] = [
      initMouse(),
      initUserInterface(),
      initDrawables(),
      init(),
    ];

    return (): void => cleanup.forEach((clean) => clean && clean());
  }, []);

  return [canvasRef, {}] as const;
};
