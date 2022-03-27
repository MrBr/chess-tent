import React from 'react';
import { components } from '@application';
import { Components } from '@types';

const { Header, Layout } = components;

const Page: Components['Page'] = ({ children }) => (
  <Layout header={<Header />}>{children}</Layout>
);

export default Page;
