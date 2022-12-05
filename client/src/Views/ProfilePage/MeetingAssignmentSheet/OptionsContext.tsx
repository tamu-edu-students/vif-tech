import React from 'react';
type MyContextType = {
  // reinstateOption: (option: string) => void,
  // stealOption: (option: string) => void,
  swapOption: (toReinstate: string, toSteal: string) => void,
  options: string[],
}
export const OptionsContext: React.Context<MyContextType> = React.createContext<MyContextType>({
  // reinstateOption: (option: string): void => {},
  // stealOption: (option: string): void => {},
  swapOption: (toReinstate: string, toSteal: string) : void => {},
  options: [],
});