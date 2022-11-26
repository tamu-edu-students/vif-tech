import { IRootState } from 'Store/reducers';

export const createLoadingSelector = (actions: any[]) => (state: IRootState): boolean => {
  // returns false only when all actions are not loading
  return actions.some((action: any) => state.loading[action]);
};

export const createErrorMessageSelector = (actions: any[]) => (state: IRootState): string[] => {
  // returns the first error messages for actions
  // * We assume when any request fails on a page that
  //   requires multiple API calls, we shows the first error
  return actions.map((action) => state.errors[action])
    .filter((error: any) => error)
};
