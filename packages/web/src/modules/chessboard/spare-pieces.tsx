import React, {
  FunctionComponent,
  ReactElement,
  useCallback,
  useMemo,
} from 'react';
import { MouchEvent } from 'chessground/types';
import { Piece, PieceColor, PieceRole } from '@types';

interface SparePiecesProps {
  onDragStart: (piece: Piece, event: MouchEvent) => void;
  className?: string;
}

const colors: PieceColor[] = ['white', 'black'];
const roles: PieceRole[] = [
  'pawn',
  'bishop',
  'knight',
  'king',
  'rook',
  'queen',
];

const SparePieces: FunctionComponent<SparePiecesProps> = ({
  onDragStart,
  className,
}) => {
  const preventSelection = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    return false;
  }, []);

  const onPieceDrag: React.MouseEventHandler<HTMLDivElement> = useCallback(
    event => {
      const role = (event.target as HTMLDivElement).dataset.role as PieceRole;
      const color = (event.target as HTMLDivElement).dataset
        .color as PieceColor;
      onDragStart(
        {
          role,
          color,
        },
        (event as unknown) as MouseEvent & TouchEvent,
      );
    },
    [onDragStart],
  );

  const sparePieces = useMemo(() => {
    return colors.reduce<ReactElement[][]>((result, color) => {
      const pieces = roles.reduce<ReactElement[]>((pieceElements, role) => {
        pieceElements.push(
          <div
            key={`${color}-${role}`}
            onMouseDown={onPieceDrag}
            data-role={role}
            data-color={color}
          >
            {color} - {role}
          </div>,
        );
        return pieceElements;
      }, []);
      result.push(pieces);
      return result;
    }, []);
  }, [onPieceDrag]);

  return (
    <div className={className} onMouseDown={preventSelection}>
      {sparePieces}
    </div>
  );
};

export { SparePieces };
