import React from 'react';
import { ui } from '@application';
import { Components } from '@types';

const { Avatar } = ui;

const UserAvatar: Components['UserAvatar'] = ({
  className,
  size,
  onClick,
  user,
}) => (
  <Avatar
    className={className}
    size={size}
    onClick={onClick}
    src={user.state.imageUrl}
    name={user.name}
  />
);
export default UserAvatar;
