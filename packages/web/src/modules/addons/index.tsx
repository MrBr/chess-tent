import React from 'react';
import { ui, components } from '@application';

const { Breadcrumbs } = ui;
const { Link } = components;

// Override default bootstrap breadcrumb item
// it makes hard refresh when opening new page
Breadcrumbs.Item = ({ href, children, title, ...props }) => (
  <li className="breadcrumb-item" {...props}>
    <Link to={href || '#'} ghost>
      {children}
    </Link>
  </li>
);
