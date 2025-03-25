import { css, Global, type Theme, useTheme } from "@emotion/react";
import type { FC } from "react";
import { memo } from "react";

export const GlobalStyle: FC = memo((): JSX.Element => {
  const { background, color }: Theme = useTheme();

  return (
    <Global
      styles={css`
        *,
        *::after,
        *::before {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        html,
        body {
          height: 100%;
          scroll-behavior: smooth;
        }
        body {
          display: flex;
          flex-direction: column;
          background: ${background};
          color: ${color};
          user-select: none;
        }
        #root {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
      `}
    />
  );
});

GlobalStyle.displayName = "GlobalStyle";
