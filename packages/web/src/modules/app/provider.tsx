import React, { ComponentType, ReactNode } from 'react';
import application from '@application';
import { Components, Services } from '@types';

const providers: ComponentType[] = [];

const Provider: Components['Provider'] = ({ children }) => (
  <>
    {providers.reduce<ReactNode>(
      (result, ChildProvider) => (
        <ChildProvider>{result}</ChildProvider>
      ),
      children,
    )}
  </>
);

const addProvider: Services['addProvider'] = ChildProvider => {
  providers.push(ChildProvider);
};
application.components.Provider = Provider;
application.services.addProvider = addProvider;
