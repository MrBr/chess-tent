import React, { ComponentType, ReactElement, useEffect } from 'react';
import { hooks, requests, services } from '@application';
import { userLoggedInAction } from './state/actions';

const { useApi, useDispatch, useActiveUser } = hooks;

const { addProvider } = services;

const Provider: ComponentType = ({ children }) => {
  const { fetch, response, error } = useApi(requests.me);
  const dispatch = useDispatch();
  const user = useActiveUser();

  useEffect(() => {
    fetch();
  }, [fetch]);
  useEffect(() => {
    if (response) {
      dispatch(userLoggedInAction(response.data));
    }
  }, [dispatch, response]);

  if (!response || (!error && !user)) {
    return <>Loading</>;
  }

  return children as ReactElement;
};

addProvider(Provider);
