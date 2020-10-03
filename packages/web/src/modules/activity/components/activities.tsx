import React from 'react';
import { components, ui } from '@application';
import { Components } from '@types';

const { Link } = components;
const { Container } = ui;

const Activities: Components['Activities'] = ({ activities }) => (
  <>
    {activities?.map(activity => (
      <Container key={activity.id}>
        <Link to={`/activity/${activity.id}`}>{activity.id}</Link>
      </Container>
    ))}
  </>
);

export default Activities;
