import { default as RSelect } from 'react-select';
import styled from '@emotion/styled';

const Select = (styled(RSelect)({
  minWidth: '220px',
}) as unknown) as typeof RSelect;

export default Select;
