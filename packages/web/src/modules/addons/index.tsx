import React from 'react';
import { ui, components } from '@application';

const { Breadcrumbs } = ui;
const { Link } = components;

// Override default bootstrap breadcrumb item
// it makes hard refresh when opening new page
Breadcrumbs.Item = props => (
  <li className="breadcrumb-item">
    <Link to={props.href || '#'} ghost>
      {props.children}
    </Link>
  </li>
);
