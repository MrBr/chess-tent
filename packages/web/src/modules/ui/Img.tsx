import styled, { css } from '@chess-tent/styled-props';
import { Size, UI } from '@types';
import React from 'react';
import { getBorderRadiusSize } from './enhancers';

export const Img: UI['Img'] = styled.img.css`${({ width, height }) => css`
  width: ${!width && !height ? '100%' : 'auto'};
`}`;

const sizeEnhancer = styled.props.size.css<{ size: Size }>`
  --thumbnail--size: 40px;
  &.extra-small {
    --thumbnail--size: 25px;
  }
  &.small {
    --thumbnail--size: 32px;
  }
  &.large {
    --thumbnail--size: 64px;
  }
  width: var(--thumbnail--size);
  height: var(--thumbnail--size);
  line-height: var(--thumbnail--size);
`;

export const Avatar = styled<UI['Avatar']>(
  ({ src, name, className, onClick }) => {
    return src ? (
      <img className={className} src={src} alt={name} onClick={onClick} />
    ) : (
      <div className={className} onClick={onClick}>
        {name?.[0] || 'A'}
      </div>
    );
  },
).css`
  border-radius: 50%;
  display: inline-block;
  background: linear-gradient(90deg, #6664CF 0%, #5026D9 100%);
  text-align: center;
  color: #fff;
  font-weight: 700;
  object-fit: cover;
  ${sizeEnhancer}
` as UI['Avatar'];

Avatar.defaultProps = {
  size: 'regular',
};

export const Thumbnail = styled.img.css`
  ${sizeEnhancer}
  ${props =>
    css`
      border-right: ${getBorderRadiusSize(props.size)};
    `}
` as UI['Thumbnail'];

Thumbnail.defaultProps = {
  size: 'regular',
};
