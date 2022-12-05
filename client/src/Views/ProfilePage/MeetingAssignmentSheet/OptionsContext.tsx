import React from 'react';

import User from 'Shared/entityClasses/User';

type OptionsContextType = {
  // reinstateOption: (option: string) => void,
  // stealOption: (option: string) => void,
  swapOption: (toReinstate: number, toSteal: number) => void,
  unassignedStudents: User[],
  setReaction: (key: string, reaction: any) => void,
}
export const OptionsContext: React.Context<OptionsContextType> = React.createContext<OptionsContextType>({
  // reinstateOption: (option: string): void => {},
  // stealOption: (option: string): void => {},
  swapOption: (toReinstate: number, toSteal: number) : void => {},
  setReaction: (key: string, reaction: any): void => {},
  unassignedStudents: [],
});