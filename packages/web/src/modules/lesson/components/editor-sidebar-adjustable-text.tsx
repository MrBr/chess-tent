import React from 'react';
import { ui } from '@application';
import styled from '@emotion/styled';
import { HtmlProps, UIComponent } from '@types';

const { Text } = ui;

export default styled<UIComponent<HtmlProps>>(props => {
  return (
    <div className={props.className}>
      <Text
        {...props}
        contentEditable
        html={props.html || 'Write lesson description'}
      />
    </div>
  );
})({
  p: {
    padding: '0.5em',
    position: 'absolute',
    height: 30,
    width: '100%',
    transition: 'max-height .5s ease-out',
    overflow: 'hidden',
    maxHeight: 30,
  },
  'p:focus': {
    maxHeight: 500,
    height: 'auto',
    background: '#F3F4F5',
  },
  position: 'relative',
  zIndex: 10,
  height: 40,
  marginBottom: 10,
});
