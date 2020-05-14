import styled from '@emotion/styled';

import { default as BForm } from 'react-bootstrap/Form';
import { default as BFormGroup } from 'react-bootstrap/FormGroup';

export const Form = BForm;
export const FormGroup = styled(BFormGroup)({
  position: 'relative',
});
