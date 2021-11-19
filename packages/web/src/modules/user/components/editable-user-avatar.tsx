import React, { FunctionComponent } from 'react';
import styled from '@emotion/styled';
import { components, ui } from '@application';
import { User } from '@chess-tent/models';

const { UserAvatar } = components;
const { Icon, Spinner } = ui;

export default styled<
  FunctionComponent<{
    className?: string;
    user: User;
    onClick: () => void;
    uploading?: boolean;
  }>
>(({ className, user, onClick, uploading }) => (
  <div className={className} onClick={onClick}>
    {uploading ? (
      <Spinner animation="grow" />
    ) : (
      <>
        <div className="edit-badge">
          <Icon type="edit" size="small" />
        </div>
        <UserAvatar user={user} size="large" />
      </>
    )}
  </div>
))({
  '.edit-badge': {
    position: 'absolute',
    textAlign: 'center',
    background: '#fff',
    height: 24,
    width: 24,
    borderRadius: '50%',
    bottom: 0,
    right: 0,
    border: '1px solid #ccc',
  },
  position: 'relative',
  display: 'inline-block',
});
