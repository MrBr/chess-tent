import React, { FunctionComponent } from 'react';

import { Step, StepComponent, StepModule } from '../app/types';
import { START_FEN } from '../chessboard';
import * as Service from './service';

const type = 'test';

type TestStepState = {
  test: 'test';
};

type TestStep = Step<TestStepState, typeof type>;

type TestModule = StepModule<TestStep, typeof type>;

const Editor: StepComponent<TestStep> = () => {
  return <div>Test</div>;
};

const Picker: FunctionComponent = () => {
  return <>Test Description </>;
};

const Playground: StepComponent<TestStep> = () => {
  return <>{'Test playground'}</>;
};

const Exercise: StepComponent<TestStep> = () => {
  return <>{'Test Description'}</>;
};

const ActionsComponent: StepComponent<TestStep> = () => {
  return <>Test Actions</>;
};

const createStep: TestModule['createStep'] = id =>
  Service.createStep<TestStep>(id, type, {
    test: 'test',
  });

const getEndSetup: TestModule['getEndSetup'] = () => ({
  position: START_FEN,
  shapes: [],
});

const Module: TestModule = {
  Editor,
  Picker,
  Playground,
  Exercise,
  Actions: ActionsComponent,
  createStep,
  getEndSetup,
  type,
};

export default Module;
