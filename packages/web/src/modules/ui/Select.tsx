import styled from '@emotion/styled';
import { default as RSelect, components } from 'react-select';

export const Option = components.Option;

const Select = (styled(RSelect)({
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
