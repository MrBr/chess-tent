import { default as BDropdown } from 'react-bootstrap/Dropdown';
import styled from '@emotion/styled';

const Toggle = styled.div({
  width: '100%',
  background: '#F3F4F5',
  borderRadius: 10,
  padding: '15px 16px 14px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

// @ts-ignore
BDropdown.Menu = styled(BDropdown.Menu)({
  width: '100%',
});

// @ts-ignore
BDropdown.Toggle.defaultProps = {
  as: Toggle,
};

export { BDropdown as Dropdown };
