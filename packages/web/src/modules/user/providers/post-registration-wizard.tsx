import React, { ComponentType, ReactElement, useEffect } from 'react';
import { hooks, services } from '@application';
import { LocationState } from '@types';
import FunnelWizard from '../components/funnel-wizard';
import ChessDetailsStep from '../components/steps/chess-details';
import TeachingStep from '../components/steps/teaching';

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
    <FunnelWizard
      steps={[ChessDetailsStep, TeachingStep]}
      close={close}
      title="Tell us a bit about yourself"
      subtitle={
        user?.coach
          ? 'This will help students to find you'
          : 'This will help the platform suggest better actions'
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
