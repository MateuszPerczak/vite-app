// import type { Drawables, Mouse, Position } from "../useCanvas.types";

// export const getDrawablesFromPointing = ({ x, y }: Position, drawables: Drawables[]) => {
//   const matches = drawables.filter(({ position, dimensions }) => {
//     return (
//       x >= position.x &&
//       x <= position.x + dimensions.w &&
//       y >= position.y &&
//       y <= position.y + dimensions.h
//     );
//   });

//   if (matches.length === 0) {
//     return null;
//   }

//   return matches;
// };

// export const getDrawablesIds = (drawables: Drawables[] | null) => {
//   if (drawables === null) return null;
//   return drawables.map(({ id }) => id);
// };

// export const getDrawablesFromId = (
//   drawables: Drawables[] | null,
//   ids: string[] | null,
// ) => {
//   if (drawables === null || ids === null) return null;
//   return drawables.filter(({ id }) => ids.includes(id));
// };

// export const getDrawablesOffsets = (
//   { position: { x, y } }: Mouse,
//   drawables: Drawables[] | null,
// ) => {
//   if (drawables === null) return null;

//   return drawables.reduce<Record<string, Position>>((acc, { id, position }) => {
//     acc[id] = { x: position.x - x, y: position.y - y };
//     return acc;
//   }, {});
// };

// export const getDrawablePositionFromOffset = (
//   { x, y }: Position,
//   offset?: Position,
// ): Position => {
//   if (offset === undefined) return { x, y };

//   return {
//     x: x + offset.x,
//     y: y + offset.y,
//   };
// };

// export const getDrawablesFromSelecting = (
//   { position, clickedPos, isMouseDown }: Mouse,
//   drawables: Drawables[],
// ) => {
//   if (clickedPos === null || !isMouseDown) return null;
//   const matches = drawables.filter((drawable) => {
//     //
//     const selectionRect = {
//       x: Math.min(position.x, clickedPos.x),
//       y: Math.min(position.y, clickedPos.y),
//       w: Math.abs(
//         Math.min(
//           Math.min(position.x, clickedPos.x) - position.x,
//           Math.min(position.x, clickedPos.x) - clickedPos.x,
//         ),
//       ),
//       h: Math.abs(
//         Math.min(
//           Math.min(position.y, clickedPos.y) - position.y,
//           Math.min(position.y, clickedPos.y) - clickedPos.y,
//         ),
//       ),
//     } as const;

//     return (
//       drawable.position.x + drawable.dimensions.w >= selectionRect.x &&
//       drawable.position.x <= selectionRect.x + selectionRect.w &&
//       drawable.position.y + drawable.dimensions.h >= selectionRect.y &&
//       drawable.position.y <= selectionRect.y + selectionRect.h
//     );
//   });
//   if (matches.length === 0) return null;

//   return matches;
// };

// export const mergeDrawables = (
//   drawablesOne: Drawables[] | null,
//   drawablesTwo: Drawables[] | null,
// ) => {
//   if (drawablesOne === null && drawablesTwo === null) return null;
//   return Array.from(new Set([...(drawablesOne ?? []), ...(drawablesTwo ?? [])]));
// };
