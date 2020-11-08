import { Utils } from '@types';

export const mediaQueryEnhancer: Utils['mediaQueryEnhancer'] = (
  screenSize,
  style,
) => {
  let query;
  switch (screenSize) {
    case 'sm':
      query = '(min-width: 575px) and (max-width: 767px)';
      break;
    case 'md': {
      query = '(min-width: 768px) and (max-width: 991px)';
      break;
    }
    case 'lg': {
      query = '(min-width: 992px) and (max-width: 1199px)';
      break;
    }
    case 'xl': {
      query = '(min-width: 1200px)';
      break;
    }
    case 'xs':
    default:
      query = '(max-width: 574px)';
      break;
  }
  return {
    [`@media ${query}`]: style,
  };
};
