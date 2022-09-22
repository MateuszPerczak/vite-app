import type { FC, PropsWithChildren } from "react";

const AppProvider: FC<PropsWithChildren> = ({ children }): JSX.Element => {
  return <div>{children}</div>;
};

export default AppProvider;
