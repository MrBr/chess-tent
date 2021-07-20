import React, { ComponentType, ReactElement, useEffect } from 'react';
import { hooks, requests, services } from '@application';

const {
  useApi,
  useDispatch,
  useActiveUserRecord,
  useComponentState,
  useSocketSubscribe,
} = hooks;

const { addProvider } = services;

const Provider: ComponentType = ({ children }) => {
  const { mounted } = useComponentState();
  const { fetch, response, loading, reset } = useApi(requests.me);
  const dispatch = useDispatch();
  const { value: user, update: updateActiveUser } = useActiveUserRecord(null);
  const userId = user?.id;

  useSocketSubscribe(userId ? `user-${userId}` : null);

  useEffect(() => {
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (response) {
      updateActiveUser(response.data);
    }
    return;
  }, [dispatch, response, updateActiveUser]);

  useEffect(() => {
    if (user) {
      // Once logged in clear the state
      reset();
    }
  }, [user, response, reset]);

  if (!mounted || loading || (response && !user)) {
    return <>Loading</>;
  }

  return children as ReactElement;
};

addProvider(Provider);
