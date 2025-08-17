import React, { createContext, useContext, useState, ReactNode } from "react";

interface NavigationBlockContextType {
  blockNavigation: boolean;
  setBlockNavigation: (block: boolean) => void;
  onTryNavigate: (() => Promise<boolean>) | null;
  setOnTryNavigate: (cb: (() => Promise<boolean>) | null) => void;
}

const NavigationBlockContext = createContext<NavigationBlockContextType | undefined>(undefined);

export const NavigationBlockProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blockNavigation, setBlockNavigation] = useState(false);
  const [onTryNavigate, setOnTryNavigate] = useState<(() => Promise<boolean>) | null>(null);

  return (
    <NavigationBlockContext.Provider value={{ blockNavigation, setBlockNavigation, onTryNavigate, setOnTryNavigate }}>
      {children}
    </NavigationBlockContext.Provider>
  );
};

export function useNavigationBlock() {
  const ctx = useContext(NavigationBlockContext);
  if (!ctx) throw new Error("useNavigationBlock must be used within NavigationBlockProvider");
  return ctx;
}
