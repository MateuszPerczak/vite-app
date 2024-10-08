import { useCanvas } from "@hooks/index";
import type { FC } from "react";

import { GlobalStyle } from "..";

export const AppContent: FC = (): JSX.Element => {
  const [ref] = useCanvas();

  return (
    <>
      <canvas
        ref={ref}
        style={{ outline: "1px solid white" }}
        width={1500}
        height={900}
      />
      <GlobalStyle />
    </>
  );
};
