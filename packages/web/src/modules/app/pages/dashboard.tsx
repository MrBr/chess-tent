import React from 'react';
import { components } from '@application';

const { Header, Link } = components;

export default () => (
  <>
    <Header />
    <Link to="/me">My profile</Link>
  </>
);
