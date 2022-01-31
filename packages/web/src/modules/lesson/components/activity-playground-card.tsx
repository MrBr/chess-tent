import React from 'react';
import styled from '@emotion/styled';

export default styled(({ children, className, onClick }) => (
  <div className={className} onClick={onClick}>
    {children}
  </div>
))({
  padding: '8px 12px',
  marginBottom: 16,
  boxShadow:
    '0px 1px 8px 1px rgba(24, 34, 53, 0.05), inset 4px 0px 0px #3048CF',
  borderRadius: 6,
});
