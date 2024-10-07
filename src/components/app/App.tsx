import type { FC } from "react";

import { AppContent, AppProvider } from "..";

export const App: FC = (): JSX.Element => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};
