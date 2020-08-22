import React, { ComponentType, useMemo } from 'react';
import application, { state } from '@application';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';

const { getRootReducer, middleware } = state;

const StateProvider: ComponentType = ({ children }) => {
  const store = useMemo(
    () => createStore(getRootReducer(), applyMiddleware(...middleware)),
    [],
  );

  return <Provider store={store}>{children}</Provider>;
};

application.components.StateProvider = StateProvider;
