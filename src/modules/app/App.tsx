// @ts-nocheck
import React, { Component } from 'react';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import styled from '@emotion/styled';

import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import './theme.css';

import { appReducer } from './redux';

import { Exercise } from '../trainer';

const store = createStore(combineReducers(appReducer), applyMiddleware(logger));

const Step = styled(({ step, className }) => {
  return (
    <div className={className}>
      <div className="content">{step.content}</div>
      <div className="children">
        <Stepper steps={step.children}></Stepper>
      </div>
    </div>
  );
})({
  flex: 1,
});

const StepMark = styled(({ step, className }) => {
  return <div className={className}>{step.type}</div>;
})({
  flex: '0 0 20px',
  height: 20,
  marginLeft: 15,
  borderRadius: '50%',
  background: '#ccc',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const Stepper = styled(({ steps, current, className }) => {
  return (
    <div className={className}>
      <div className="line"></div>
      {steps.reduce((result, step, index) => {
        result.push(
          <div className="step-container">
            <StepMark step={step} />
            <Step step={step} />
          </div>,
        );
        return result;
      }, [])}
    </div>
  );
})({
  '.line': {
    position: 'absolute',
    left: 25,
    zIndex: -1,
    top: 0,
    width: 1,
    background: '#000',
    height: '100%',
  },
  '.step-container': {
    display: 'flex',
    margin: '20px 0',
    flex: '0 0 0',
  },
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: 300,
  height: '100%',
  maxHeight: '100%',
});

const Action = styled.span({
  display: 'inline-block',
  padding: '0 10px',
});

const steps = [
  {
    id: 1,
    content: [
      <Action>e4</Action>,
      <Action>ed</Action>,
      <Action>e4</Action>,
      <Action>ed</Action>,
      <Action>e4</Action>,
      <Action>ed</Action>,
      <Action>e4</Action>,
      <Action>ed</Action>,
      <Action>e4</Action>,
      <Action>ed</Action>,
      <Action>e4</Action>,
      <Action>ed</Action>,
      <Action>e4</Action>,
      <Action>ed</Action>,
      <Action>e4</Action>,
      <Action>ed</Action>,
    ],
    children: [],
  },
  {
    id: 2,
    content: [<Action>e4</Action>],
    children: [],
  },
];

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        {/*<Stepper steps={steps}></Stepper>*/}
        <Exercise />
      </Provider>
    );
  }
}

export default App;
