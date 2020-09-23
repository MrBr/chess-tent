import React, { useEffect } from 'react';
import { components, hooks, requests, ui } from '@application';
import { Activity } from '@chess-tent/models';
import { Components } from '@types';

const { useRecord, useApi } = hooks;
const { Link } = components;
const { Container } = ui;

const Activities: Components['Activities'] = ({ owner }) => {
  const { fetch, response } = useApi(requests.activities);
  const [activities, saveActivities] = useRecord<Activity[]>(
    `${owner.id}-activities`,
  );

  useEffect(() => {
    if (!activities) {
      fetch({ owner: owner.id, users: owner.id });
    }
  }, [fetch, activities, owner.id]);

  useEffect(() => {
    if (response) {
      saveActivities(response.data);
    }
  }, [saveActivities, response]);

  return (
    <>
      <h2>Activities</h2>
      {activities?.map(activity => (
        <Container key={activity.id}>
          <Link to={`/activity/${activity.id}`}>{activity.id}</Link>
        </Container>
      ))}
    </>
  );
};

export default Activities;
