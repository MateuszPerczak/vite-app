// import type { Drawable, DrawableProps, Offset } from "./drawable.types";

// export const newDrawable = (props: DrawableProps): Drawable => {
//   const drawable: Omit<Drawable, "render"> = {
//     ...props,
//     id: "",
//   };

//   const renderChildren = (
//     context: CanvasRenderingContext2D,
//     offset: Offset,
//     children: DrawableProps[],
//   ) => {
//     let stackX = offset.x;
//     children.forEach((child) => {
//       context.strokeStyle = "#f8c54e";
//       context.strokeRect(
//         stackX + child.position.x,
//         offset.y + child.position.y,
//         child.dimensions.w,
//         child.dimensions.h,
//       );
//       context.fillStyle = "#f8c54e";
//       context.fillText(
//         "Child",
//         stackX + child.position.x,
//         offset.y + child.position.y - 5,
//       );
//       stackX += child.dimensions.w;
//       if (child.children) {
//         const childrenOffset: Offset = {
//           x: offset.x + child.position.x + (child.padding?.left ?? 0),
//           y: offset.y + child.position.y + (child.padding?.left ?? 0),
//         };
//         renderChildren(context, childrenOffset, child.children);
//       }
//     });
//   };

//   const render = (context: CanvasRenderingContext2D) => {
//     const { width } = context.measureText("M");

//     context.strokeStyle = "#ff00cc";
//     context.strokeRect(
//       drawable.position.x,
//       drawable.position.y,
//       drawable.dimensions.w,
//       drawable.dimensions.h,
//     );
//     context.fillStyle = "#ff00cc";
//     context.fillText("Drawable", drawable.position.x, drawable.position.y - 5);

//     if (drawable.padding) {
//       context.strokeStyle = "#00ffcc";
//       context.fillStyle = "#00ffcc";
//       context.fillText(
//         "Padding",
//         drawable.position.x + (drawable.padding.left ?? 0) + 5,
//         drawable.position.y + (drawable.padding.top ?? 0) + 5 + width,
//       );
//       context.strokeRect(
//         drawable.position.x + (drawable.padding.left ?? 0),
//         drawable.position.y + (drawable.padding.top ?? 0),
//         drawable.dimensions.w -
//           (drawable.padding.left ?? 0) -
//           (drawable.padding.right ?? 0),
//         drawable.dimensions.h -
//           (drawable.padding.top ?? 0) -
//           (drawable.padding.bottom ?? 0),
//       );
//     }

//     // if (drawable.children) {
//     //   const offset: Offset = {
//     //     x: drawable.position.x + (drawable.padding?.left ?? 0),
//     //     y: drawable.position.y + (drawable.padding?.top ?? 0),
//     //   };
//     //   renderChildren(context, offset, drawable.children);
//     // }

//     //   yellowColorPrimary: "#f8c54e",
//     //   greenColorPrimary: "#00ffcc",
//     //   blueColorPrimary: "#00ccff",
//     //   redColorPrimary: "#ff00cc",
//   };

//   return {
//     ...drawable,
//     render,
//   };
// };
