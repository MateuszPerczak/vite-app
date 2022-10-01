import { ThemeProvider } from "@emotion/react";
import type { FC, PropsWithChildren } from "react";
import useTheme from "@hooks/useTheme";

const AppProvider: FC<PropsWithChildren> = ({ children }): JSX.Element => {
  const theme = useTheme();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default AppProvider;
