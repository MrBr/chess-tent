import React from 'react';
import { ui } from '@application';
import { Components } from '@types';

const { Dropdown } = ui;

const StandItem: Components['NotificationStandItem'] = ({
  onClick,
  title,
  subtitle,
}) => {
  return (
    <Dropdown.Item onClick={onClick} className="text-wrap">
      <div>{title}</div>
      <small>{subtitle}</small>
    </Dropdown.Item>
  );
};

export default StandItem;
