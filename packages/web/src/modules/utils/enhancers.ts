import { Utils } from '@types';

export const mediaQueryEnhancer: Utils['mediaQueryEnhancer'] = (
  screenSize,
  style,
) => {
  let query;
  switch (screenSize) {
    case 'sm':
      query = 'min-width: 575px';
      break;
    case 'md': {
      query = 'min-width: 768x';
      break;
    }
    case 'lg': {
      query = 'min-width: 992px';
      break;
    }
    case 'xl': {
      query = 'min-width: 1200px';
      break;
    }
    case 'xs':
    default:
      query = 'max-width: 575px';
      break;
  }
  return {
    [`@media (${query})`]: style,
  };
};
