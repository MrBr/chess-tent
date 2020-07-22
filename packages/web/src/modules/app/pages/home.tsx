import React from 'react';
import { components, pages } from '@application';

const { Authorized } = components;
const { Landing, Dashboard } = pages;

export default () => (
  <Authorized>
    {authorized => (!!authorized ? <Dashboard /> : <Landing />)}
  </Authorized>
);
