import useSystemTheme from "react-use-system-theme";

import themes, { ColorThemes, Theme } from "../theme/themes";

const useTheme = (): Theme => {
  const systemTheme: ColorThemes = useSystemTheme(ColorThemes.Dark);
  return themes[systemTheme];
};

export default useTheme;
