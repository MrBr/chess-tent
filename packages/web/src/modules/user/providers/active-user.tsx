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

const UserSocketProvider: ComponentType<{ userId: string }> = ({
  children,
  userId,
}) => {
  useSocketSubscribe(`user-${userId}`);

  return children as ReactElement;
};

const Provider: ComponentType = ({ children }) => {
  const { mounted } = useComponentState();
  const { fetch, response, loading, reset } = useApi(requests.me);
  const dispatch = useDispatch();
  const { value: user, update: updateActiveUser } = useActiveUserRecord(null);

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

  if (user) {
    return <UserSocketProvider userId={user.id}>{children}</UserSocketProvider>;
  }

  return children as ReactElement;
};

addProvider(Provider);
