import { default as RSelect } from 'react-select';
import { default as RSAsync } from 'react-select/async';
import styled from '@emotion/styled';

const selectStyle = {
  minWidth: '220px',
  '.select__control': {
    backgroundColor: '#F3F4F5',
    borderRadius: 10,
    borderColor: 'transparent',
    borderWidth: 0,
    fontWeight: 400,
    fontSize: 14,
  },
  '.select__indicator-separator': {
    display: 'none',
  },
};
const Select = (styled(RSelect)(selectStyle) as unknown) as typeof RSelect;
const AsyncSelect = (styled(RSAsync)(selectStyle) as unknown) as typeof RSelect;

Select.defaultProps = {
  ...Select.defaultProps,
  //@ts-ignore
  classNamePrefix: 'select',
};

AsyncSelect.defaultProps = {
  ...RSAsync.defaultProps,
  //@ts-ignore
  classNamePrefix: 'select',
};

export { Select, AsyncSelect };
