import React from 'react';
import styled from '@emotion/styled';

const Step = styled(({ children, className, onClick }: any) => {
  return (
    <div className={className} onClick={onClick}>
      {children}
    </div>
  );
})({
  '&  > &': {
    marginLeft: 20,
  },
  display: 'inline-block',
  width: 40,
  height: 40,
  position: 'relative',
  borderRadius: '50%',
  maxWidth: 40,
  overflow: 'hidden',
  background: '#EE7B00FF',
  color: '#fff',
  padding: 5,
});

export default Step;
