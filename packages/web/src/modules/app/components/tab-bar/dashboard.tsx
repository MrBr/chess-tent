import React from 'react';
import { components, ui } from '@application';

import TabBarContainer from './container';
import TabButton from './tab-button';

const { Icon } = ui;
const { UserSettings } = components;

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
        Template
      </TabButton>
      <TabButton path="/coaches">
        <Icon type="crown" textual />
        Coaches
      </TabButton>
      <TabButton>
        <UserSettings />
      </TabButton>
    </TabBarContainer>
  );
};

export default TabBarDashboard;
