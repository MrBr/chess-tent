import React from 'react';
import { components } from '@application';
import { Components } from '@types';

const { Header, Layout, Conversations } = components;

const Page: Components['Page'] = ({ children }) => (
  <Layout header={<Header />} sidebar={<Conversations />}>
    {children}
  </Layout>
);

export default Page;
