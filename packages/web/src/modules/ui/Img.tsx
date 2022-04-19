import styled from '@emotion/styled';
import { UI } from '@types';
import React, { ComponentProps } from 'react';
import { getBorderRadiusSize } from './enhancers';

export const Img = styled.img(
  ({ width, height }) =>
    !width &&
    !height && {
      width: '100%',
    },
) as UI['Img'];

const sizeEnhancer = (props: ComponentProps<UI['Avatar']>) => {
  let size;
  switch (props.size) {
    case 'extra-small':
      size = 25;
      break;
    case 'small':
      size = 32;
      break;
    case 'large':
      size = 64;
      break;
    case 'regular':
    default:
      size = 40;
  }
  return {
    width: size,
    height: size,
    lineHeight: size + 'px',
  };
};

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
)(
  {
    borderRadius: '50%',
    display: 'inline-block',
    background: 'linear-gradient(90deg, #6664CF 0%, #5026D9 100%)',
    textAlign: 'center',
    color: '#fff',
    fontWeight: 700,
  },
  sizeEnhancer,
);
Avatar.defaultProps = {
  size: 'regular',
};

export const Thumbnail = styled.img(sizeEnhancer, props => ({
  borderRadius: getBorderRadiusSize(props.size),
}));
Thumbnail.defaultProps = {
  size: 'regular',
};
