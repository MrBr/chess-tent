import React from 'react';
import { ui } from '@application';

import TabBarContainer from './container';
import TabButton from './tab-button';

const { Icon } = ui;

const TabBarDashboard = () => {
  return (
    <TabBarContainer>
      <TabButton path="/">
        <Icon type="home" textual />
        Dashboard
      </TabButton>
      <TabButton path="/lessons">
        <Icon type="chess" textual />
        Lessons
      </TabButton>
      <TabButton path="/lesson/new">
        <Icon type="plus" textual />
        Create
      </TabButton>
      <TabButton path="/coaches">
        <Icon type="crown" textual />
        Coaches
      </TabButton>
    </TabBarContainer>
  );
};

export default TabBarDashboard;
