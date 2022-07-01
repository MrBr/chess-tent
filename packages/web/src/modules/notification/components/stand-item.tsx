import React from 'react';
import { ui } from '@application';
import { Components } from '@types';

const { Dropdown } = ui;

const StandItem: Components['NotificationStandItem'] = ({
  children,
  onClick,
}) => {
  return (
    <Dropdown.Item onClick={onClick} className="text-wrap">
      {children}
    </Dropdown.Item>
  );
};

export default StandItem;
