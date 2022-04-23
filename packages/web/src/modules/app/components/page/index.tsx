import React from 'react';
import { components } from '@application';
import { Components } from '@types';

import HeaderDashboard from '../header/dashboard';
import TabBarDashboard from '../tab-bar/dashboard';

const { Layout, Menu } = components;

const Page: Components['Page'] = ({ children, header, tabbar }) => {
  const headerElement = header || <HeaderDashboard />;
  const footerElement = tabbar || <TabBarDashboard />;
  return (
    <Layout menu={<Menu />} header={headerElement} footer={footerElement}>
      {children}
    </Layout>
  );
};

export default Page;
