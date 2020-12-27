import React, { FunctionComponent } from 'react';
import { components } from '@application';

const { Back, Layout } = components;

const MobileScreen: FunctionComponent = ({ children }) => {
  return (
    <Layout footer={null} header={<Back />}>
      {children}
    </Layout>
  );
};

export default MobileScreen;
