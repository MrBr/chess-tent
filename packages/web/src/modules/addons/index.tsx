import React from 'react';
import { ui, components } from '@application';

const { Breadcrumbs } = ui;
const { Link } = components;

// Override default bootstrap breadcrumb item
// it makes hard refresh when opening new page
Breadcrumbs.Item = ({ href, children, title, className, ...props }) => (
  <li className={`breadcrumb-item ${className}`} {...props}>
    <Link to={href || '#'} ghost>
      {children}
    </Link>
  </li>
);
