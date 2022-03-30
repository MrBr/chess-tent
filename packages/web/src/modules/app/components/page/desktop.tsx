import React from 'react';
import { components } from '@application';
import { Components } from '@types';

const { Header, Layout, Menu } = components;

const Page: Components['Page'] = ({ children }) => (
  <Layout header={<Header />} menu={<Menu />}>
    {children}
  </Layout>
);

export default Page;
