import { ComponentProps } from 'react';
import { default as BDropdown } from 'react-bootstrap/Dropdown';
import styled from '@emotion/styled';
import { UI } from '@types';

const sizeEnhancer = (props: ComponentProps<UI['Dropdown']['Toggle']>) => {
  switch (props.size) {
    case 'extra-small':
      return {
        fontSize: 12,
        padding: '2px 8px 3px 8px',
        lineHeight: '19px',
        borderRadius: 4,
      };
    case 'small':
      return {
        borderRadius: 6,
        fontSize: 14,
        lineHeight: '16px',
        padding: '7px 12px 8px 12px',
      };
    default:
      return {
        fontSize: 16,
        borderRadius: 10,
        padding: '15px 16px 14px 16px',
      };
  }
};

const Toggle = styled.div(
  {
    width: '100%',
    background: '#F3F4F5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sizeEnhancer,
  ({ collapse }: ComponentProps<UI['Dropdown']['Toggle']>) =>
    collapse && {
      ':after': { display: 'none' },
      background: 'transparent',
      paddingLeft: 0,
      paddingRight: 0,
    },
);

// @ts-ignore
BDropdown.Menu = styled(BDropdown.Menu)({
  width: '100%',
});

// @ts-ignore
BDropdown.Toggle.defaultProps = {
  as: Toggle,
};

export default BDropdown as UI['Dropdown'];
