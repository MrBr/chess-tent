import styled from '@emotion/styled';
import React, { FunctionComponent } from 'react';
import { PieceRolePromotable, Promotion } from '@types';

export default styled<
  FunctionComponent<{
    promotion: Promotion;
    className?: string;
    onPromote: (promotion: Promotion, role: PieceRolePromotable) => void;
    onCancel: () => void;
  }>
>(({ className, promotion, onPromote, onCancel }) => {
  const {
    piece: { color },
  } = promotion;
  const roles: PieceRolePromotable[] = ['bishop', 'knight', 'rook', 'queen'];
  return (
    <div className={className} onContextMenu={onCancel} onClick={onCancel}>
      <div className="promotion-pieces">
        {roles.map(role => (
          <div className="promotion-piece" key={role}>
            <span
              className={`piece ${color} ${role}`}
              onClick={event => {
                event.stopPropagation();
                onPromote(promotion, role);
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
    zIndex: 100,
    top: 0,
  },
  ({ promotion }) => ({
    '.promotion-pieces': {
      left: `${(parseInt(promotion.to.charAt(1)) as number) * 12.5}%`,
    },
  }),
);
