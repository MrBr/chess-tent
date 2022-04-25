import { useContext } from 'react';
import { BoardContext } from './context';

export const useChessboardContext = () => {
  return useContext(BoardContext);
};
