import { register } from 'core-module';
import { Requests } from '@chess-tent/types';
import { Components } from './components';
import { UI } from './ui';
import { StepModules } from './steps';
import { Socket } from './socket';
import { HOC } from './hoc';
import { Model } from './model';
import { State } from './state';
import { Hooks } from './hooks';
import { Services } from './service';
import { Utils } from './utils';
import { Pages } from './pages';
import { Constants } from './constants';
import { Context } from './context';

export * from '@chess-tent/types';
export * from './activity';
export * from './hoc';
export * from './context';
export * from './chess';
export * from './step';
export * from './steps';
export * from './components';
export * from './ui';
export * from './socket';
export * from './constants';
export * from './model';
export * from './hooks';
export * from './state';
export * from './service';
export * from './utils';
export * from './pages';
export * from './notification';
export * from './_helpers';

export type Application = {
  services: Services;
  register: typeof register;
  init: () => Promise<any>;
  start: () => void;
  ui: UI;
  pages: Pages;
  components: Components;
  requests: Requests;
  constants: Constants;
  hooks: Hooks;
  state: State;
  utils: Utils;
  socket: Socket;
  model: Model;
  stepModules: StepModules;
  hoc: HOC;
  context: Context;
};
