import React from 'react';
import { ui, hooks } from '@application';

const { Icon } = ui;
const { useHistory } = hooks;

const Back = () => {
  const history = useHistory();
  return <Icon onClick={history.goBack} type="close" />;
};

export default Back;
