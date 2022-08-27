import React, { ComponentType, ReactElement, useEffect } from 'react';
import { hooks, services } from '@application';
import { LocationState } from '@types';
import RoleWizard from '../components/role-wizard';
import ChessDetailsStep from '../components/steps/chess-details';
import TeachingStep from '../components/steps/teaching';
import FinalizeStep from '../components/steps/finalize';

const { useLocation, usePrompt, useActiveUserRecord } = hooks;
const { addProvider } = services;

const shouldShowWizard = (state?: LocationState) =>
  state?.from
    ? state?.from?.search(/^.*?\bregister\b.*?\bflow\b.*?$/) > -1
    : false;

const Provider: ComponentType = ({ children }) => {
  const { state } = useLocation();
  const { value: user } = useActiveUserRecord(null);

  const [prompt, promptWizard] = usePrompt(close => (
    <RoleWizard
      steps={[ChessDetailsStep, TeachingStep, FinalizeStep]}
      close={close}
      title="Tell us a bit about yourself"
      subtitle={
        user?.coach
          ? 'This will help students find you more easily'
          : 'This will help the platform make better suggestions'
      }
    />
  ));

  useEffect(() => {
    if (shouldShowWizard(state) && user?.id) {
      promptWizard();
    }
  }, [user?.id, state, promptWizard]);

  return (
    <>
      {prompt}
      {children as ReactElement}
    </>
  );
};

addProvider(Provider);
