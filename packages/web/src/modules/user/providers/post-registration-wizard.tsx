import React, { ComponentType, ReactElement, useEffect } from 'react';
import { hooks, services } from '@application';
import { LocationState } from '@types';
import { User } from '@chess-tent/models';
import RoleWizard, { RoleWizardProps } from '../components/role-wizard';

const { useLocation, usePrompt, useActiveUserRecord } = hooks;
const { addProvider } = services;

const getUserFlow = (user: User, state?: LocationState) => {
  if (!state?.from) {
    return user?.coach ? 'teach' : 'student';
  }
  const flow = new URLSearchParams('?' + state.from.split('?')[1]).get(
    'flow',
  ) as RoleWizardProps['flow'];
  return flow;
};

const shouldShowWizard = (state?: LocationState, elo?: number) =>
  state?.from && !elo
    ? state?.from?.search(/^.*?\bregister\b.*?\bflow\b.*?$/) > -1
    : false;

const Provider: ComponentType = ({ children }) => {
  const { state } = useLocation();
  const { value: user } = useActiveUserRecord(null);

  const [prompt, promptWizard] = usePrompt(close => (
    <RoleWizard
      flow={getUserFlow(user as User, state) as RoleWizardProps['flow']}
      close={close}
    />
  ));

  useEffect(() => {
    if (shouldShowWizard(state, user?.state.elo) && user?.id) {
      promptWizard();
    }
  }, [user?.id, user?.state.elo, state, promptWizard]);

  return (
    <>
      {prompt}
      {children as ReactElement}
    </>
  );
};

addProvider(Provider);
