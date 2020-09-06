import styled from '@emotion/styled';
import { UI } from '@types';
import { ComponentProps } from 'react';
import { getBorderRadiusSize } from './enhancers';

export const Img = styled.img({ width: '100%' }) as UI['Img'];

const sizeEnhancer = (props: ComponentProps<UI['Avatar']>) => {
  let size;
  switch (props.size) {
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
  };
};

export const Avatar = styled.img(
  {
    borderRadius: '50%',
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
