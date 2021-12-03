import React, { createContext, useState } from 'react';
import { ChessboardContext, Components } from '@types';

export const BoardContext = createContext<ChessboardContext>({
  evaluate: false,
  evaluations: {},
  renderPrompt: undefined,
  promotion: undefined,
  update: () => {},
});

export const ChessboardContextProvider: Components['ChessboardContextProvider'] = ({
  children,
}) => {
  const [state, setState] = useState<ChessboardContext>({
    evaluate: false,
    evaluations: {},
    renderPrompt: undefined,
    promotion: undefined,
    update: (patch: Partial<ChessboardContext>) => {
      setState(prevState => ({
        ...prevState,
        ...patch,
      }));
    },
  });

  return (
    <BoardContext.Provider value={state}>{children}</BoardContext.Provider>
  );
};
