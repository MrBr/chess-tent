import styled from '@emotion/styled';
import { UI } from '@types';
import React, { ComponentProps } from 'react';
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

export const FramedProfile = ({ src }: { src?: string }) => (
  <svg
    width="292"
    height="190"
    viewBox="0 0 292 190"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <mask
      id={'fp-' + src}
      mask-type="alpha"
      maskUnits="userSpaceOnUse"
      x="-92"
      y="-134"
      width="384"
      height="357"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M60.025 -79.3243C85.6423 -85.5136 112.141 -90.5494 136.947 -82.3663C161.134 -74.3879 175.169 -52.1746 193.818 -35.1896C217.348 -13.7592 252.642 -0.763756 260.285 29.9669C268.312 62.2427 254.775 98.0249 233.489 124.322C212.897 149.762 179.213 158.326 147.955 168.743C117.355 178.94 86.3413 189.845 54.8516 183.853C21.4725 177.501 -11.9493 162.397 -30.7315 134.743C-49.0532 107.766 -44.9421 72.7215 -42.7735 40.1123C-40.7827 10.1764 -38.6488 -21.6712 -18.7957 -44.7376C0.278024 -66.8984 31.4399 -72.4179 60.025 -79.3243Z"
        fill="url(#paint0_linear)"
      />
    </mask>
    <g mask={'url(#fp-' + src + ')'}>
      <g filter="url(#filter0_d)">
        <rect
          width="260"
          height="200"
          rx="16"
          fill={'url(#fp-pattern' + src + ')'}
        />
      </g>
    </g>
    <defs>
      <filter
        id="filter0_d"
        x="0"
        y="-3"
        width="276"
        height="216"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="4" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow"
          result="shape"
        />
      </filter>
      <pattern
        id={'fp-pattern' + src}
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref={'#fp-image' + src + ''}
          transform="translate(0 -0.375309) scale(0.00301205 0.00389703)"
        />
      </pattern>
      <linearGradient
        id="paint0_linear"
        x1="-46.6905"
        y1="96.6244"
        x2="247.224"
        y2="-7.55637"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#F46F24" />
        <stop offset="1" stop-color="#F44D24" />
      </linearGradient>
      {src && (
        <image
          id={'fp-image' + src + ''}
          width="332"
          height="498"
          xlinkHref={src}
        />
      )}
    </defs>
  </svg>
);
