import React from 'react';
import { ui } from '@application';
import { Components } from '@types';

const { Avatar } = ui;

const UserAvatar: Components['UserAvatar'] = ({ size, onClick, user }) => (
  <Avatar
    size={size}
    onClick={onClick}
    src={user.state.imageUrl}
    name={user.name}
  />
);
export default UserAvatar;
