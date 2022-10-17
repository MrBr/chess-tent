import React from 'react';
import { Components } from '@types';
import { services } from '@application';
import { css } from '@chess-tent/styled-props';

const { getFenPosition } = services;

const { className } = css`
  padding-top: 100%;

  cg-board {
    width: 100%;
    height: 100%;
  }
`;

const PieceClassMap = {
  r: 'black rook',
  q: 'black queen',
  n: 'black knight',
  b: 'black bishop',
  k: 'black king',
  p: 'black pawn',
  R: 'white rook',
  Q: 'white queen',
  N: 'white knight',
  B: 'white bishop',
  K: 'white king',
  P: 'white pawn',
};

const BoardPreview: Components['ChessboardPreview'] = ({ fen }) => {
  const position = getFenPosition(fen);
  const ranks = position.split('/');

  return (
    <div className={`cg-wrap ${className}`}>
      <cg-board>
        {ranks.map((rank, rankIndex) => {
          const pieces = [];
          let fileIndex = 0;

          for (let i = 0; i < rank.length; i++) {
            const offset = parseInt(rank.charAt(i));

            if (offset) {
              fileIndex += offset;
              continue;
            }

            const piece = rank.charAt(i) as keyof typeof PieceClassMap;
            const pieceClassName = PieceClassMap[piece];
            const key = `${rankIndex} ${fileIndex} ${piece}`;

            pieces.push(
              <piece
                key={key}
                className={pieceClassName}
                style={{
                  left: `${12.5 * fileIndex}%`,
                  top: `${12.5 * rankIndex}%`,
                }}
              ></piece>,
            );

            fileIndex += 1;
          }
          return pieces;
        })}
      </cg-board>
    </div>
  );
};

export default React.memo(BoardPreview);
