import { default as RSelect } from 'react-select';
import styled from '@emotion/styled';

const Select = (styled(RSelect)({
  minWidth: '220px',
  '.select__control': {
    backgroundColor: '#F3F4F5',
    borderRadius: 10,
  },
  '.select__indicator-separator': {
    display: 'none',
  },
}) as unknown) as typeof RSelect;

Select.defaultProps = {
  ...Select.defaultProps,
  //@ts-ignore
  classNamePrefix: 'select',
};

export default Select;
