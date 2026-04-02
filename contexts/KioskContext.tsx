import {
  checkIfKioskEnabled,
  disableExitByUnpinning,
  exitKioskMode,
  startKioskMode,
} from "expo-kiosk-control";
import React, { createContext, useContext, useEffect, useState } from "react";

type KioskContextType = {
  isLocked: boolean;
  enterKioskMode: () => void;
  disableKioskMode: () => void;
};

const KioskContext = createContext<KioskContextType>({
  isLocked: false,
  enterKioskMode: () => {},
  disableKioskMode: () => {},
});

export function KioskProvider({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!checkIfKioskEnabled()) {
        startKioskMode();
        disableExitByUnpinning();
      }
      setIsLocked(true);
    };
    if (!__DEV__) init();
  }, []);

  const enter = async () => {
    startKioskMode();
    disableExitByUnpinning();
    setIsLocked(true);
  };

  const disable = async () => {
    exitKioskMode();
    setIsLocked(false);
  };

  return (
    <KioskContext.Provider
      value={{ isLocked, enterKioskMode: enter, disableKioskMode: disable }}
    >
      {children}
    </KioskContext.Provider>
  );
}

export const useKiosk = () => useContext(KioskContext);
