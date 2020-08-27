import React, { ComponentType, ReactElement, useEffect } from 'react';
import { hooks, requests, services } from '@application';

const { useApi, useDispatch, useActiveUserRecord } = hooks;

const { addProvider } = services;

const Provider: ComponentType = ({ children }) => {
  const { fetch, response, error } = useApi(requests.me);
  const dispatch = useDispatch();
  const [user, updateActiveUser] = useActiveUserRecord();

  useEffect(() => {
    fetch();
  }, [fetch]);
  useEffect(() => {
    if (response) {
      updateActiveUser(response.data);
    }
  }, [dispatch, response, updateActiveUser]);

  if (!user && !error) {
    return <>Loading</>;
  }

  return children as ReactElement;
};

addProvider(Provider);
