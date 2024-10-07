import { ThemeProvider } from "@emotion/react";
import { useTheme } from "@hooks/index";
import type { FC, PropsWithChildren } from "react";

export const AppProvider: FC<PropsWithChildren> = ({ children }): JSX.Element => {
  const theme = useTheme();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
