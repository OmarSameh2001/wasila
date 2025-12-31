"use client";
import { createContext, useContext, useEffect, useState } from "react";

export const PopupContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  component: React.ReactNode;
  setComponent: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}>({
  isOpen: false,
  setIsOpen: () => {},
  component: null,
  setComponent: () => {},
});

// export const useAuth = () => useContext(AuthContext);

export const PopupProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [component, setComponent] = useState<React.ReactNode>(null);
  
  return (
    <PopupContext.Provider
      value={{
        isOpen,
        setIsOpen,
        component,
        setComponent,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};
