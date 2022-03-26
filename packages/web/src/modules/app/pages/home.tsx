import React from 'react';
import { components, pages } from '@application';

const { Authorized } = components;
const { Landing, Dashboard } = pages;

const Home = () => (
  <Authorized>
    {authorized => (!!authorized ? <Dashboard /> : <Landing />)}
  </Authorized>
);

export default Home;
