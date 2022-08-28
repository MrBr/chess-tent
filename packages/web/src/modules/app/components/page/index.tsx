import React from 'react';
import { components, ui } from '@application';
import { Components } from '@types';

import HeaderDashboard from '../header/dashboard';
import TabBarDashboard from '../tab-bar/dashboard';

const { Layout, Menu } = components;
const { Container } = ui;

const Page: Components['Page'] = ({ children, header, tabbar }) => {
  const headerElement = header || <HeaderDashboard />;
  const footerElement = tabbar || <TabBarDashboard />;
  return (
    <Layout menu={<Menu />} header={headerElement} footer={footerElement}>
      {children}
    </Layout>
  );
};

const PageBody: Components['Page']['Body'] = ({ children, className }) => (
  <Container className={`px-3 px-sm-5 pb-4 ${className}`} fluid>
    {children}
  </Container>
);
Page.Body = PageBody;

export default Page;
