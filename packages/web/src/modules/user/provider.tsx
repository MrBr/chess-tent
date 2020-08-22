import React, { ComponentType, ReactElement, useEffect } from 'react';
import { hooks, requests, services } from '@application';
import { userLoggedInAction } from './state/actions';

const { useApi, useDispatch } = hooks;

const { addProvider } = services;

const Provider: ComponentType = ({ children }) => {
  const { fetch, response } = useApi(requests.me);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch();
  }, [fetch]);
  useEffect(() => {
    if (response) {
      dispatch(userLoggedInAction(response.data));
    }
  }, [response]);

  if (!response) {
    return <>Loading</>;
  }

  return children as ReactElement;
};

addProvider(Provider);
