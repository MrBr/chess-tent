import React from 'react';
import { components } from '@application';
import { Components } from '@types';

const { Header, Layout, TabBar } = components;

const Page: Components['Page'] = ({ children }) => (
  <Layout header={<Header />} footer={<TabBar />}>
    {children}
  </Layout>
);

export default Page;
