import styled from '@emotion/styled';
import React, { FunctionComponent } from 'react';
import { PieceColor, PieceRolePromotable } from '@types';

export default styled<
  FunctionComponent<{
    color: PieceColor;
    className?: string;
    file: string;
    onPromote: (role: PieceRolePromotable) => void;
    onCancel: () => void;
  }>
>(({ className, color, onPromote, onCancel }) => {
  const roles: PieceRolePromotable[] = ['bishop', 'knight', 'rook', 'queen'];
  return (
    <div className={className} onContextMenu={onCancel} onClick={onCancel}>
      <div className="promotion-pieces">
        {roles.map(role => (
          <div className="promotion-piece">
            <span
              className={`piece ${color} ${role}`}
              onClick={event => {
                event.stopPropagation();
                onPromote(role);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
})(
  {
    '.promotion-pieces': {
      width: '12.5%',
      height: '100%',
    },
    '.promotion-piece': {
      '&:hover': {
        background: '#efefef',
      },
      width: '100%',
      height: '12.5%',
      background: '#FAFBFB',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
    },
    '.piece': {
      width: '75%',
      height: '75%',
      display: 'inline-block',
      backgroundSize: '100%',
      backgroundRepeat: 'no-repeat',
    },
    position: 'absolute',
    width: '100%',
    height: '100%',
    background: 'rgba(255,255,255,0.5)',
  },
  ({ file }) => ({
    '.promotion-pieces': {
      left: `${(parseInt(file.charAt(1)) as number) * 12.5}%`,
    },
  }),
);
