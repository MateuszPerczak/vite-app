import { box, separator, text } from "../components";
import type { Drawables, UserInterface } from "../useCanvas.types";

export const crateUserInterface = () => {
  const mouseText = text({
    text: "X 0 Y 0",
    fontSize: 10,
  });

  const selectionText = text({
    text: "None",
    fontSize: 10,
  });

  const mouseSelectingText = text({
    text: "Mouse selecting: ",
    fontSize: 10,
  });
  const mouseDownText = text({
    text: "Mouse down: ",
    fontSize: 10,
  });

  const layout: Drawables[] = [
    box({
      children: [
        box({
          direction: "column",
          gap: 5,
          padding: {
            top: 5,
            bottom: 5,
            left: 5,
            right: 5,
          },
          children: [
            text({
              text: "Mouse position:",
              fontSize: 10,
            }),
            mouseText,
          ],
        }),
        separator({ size: 35, orientation: "vertical" }),
        box({
          gap: 5,
          direction: "column",
          padding: {
            top: 5,
            bottom: 5,
            left: 5,
            right: 5,
          },
          children: [
            text({
              text: "Selected:",
              fontSize: 10,
            }),
            selectionText,
          ],
        }),
        separator({ size: 35, orientation: "vertical" }),
        box({
          gap: 5,
          direction: "column",
          padding: {
            top: 5,
            bottom: 5,
            left: 5,
            right: 5,
          },
          children: [mouseDownText, mouseSelectingText],
        }),
      ],
    }),
  ];

  const update: UserInterface["update"] = ({ mouse, selectedDrawables }) => {
    mouseText.update({ text: `X ${mouse.position.x} Y ${mouse.position.y}` });
    selectionText.update({
      text: selectedDrawables === null ? "None" : selectedDrawables.join(", "),
    });
    mouseSelectingText.update({ text: `Mouse selecting: ${mouse.isMouseSelecting}` });
    mouseDownText.update({ text: `Mouse down: ${mouse.isMouseDown}` });
  };

  return {
    layout,
    update,
  };
};
