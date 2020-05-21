import { register, resolveDeferredRegister } from 'core-module';

import {
  Application,
  Components,
  Constants,
  Services,
  State,
  Hooks,
  Utils,
  Model,
  StepModules,
} from '@types';

const services = {} as Services;
const components = {} as Components;
const ui = {} as any;
const hooks = {} as Hooks;
const state = {
  actions: {},
  selectors: {},
} as State;
const utils = {} as Utils;
const model = {} as Model;
const stepModules = {} as StepModules;
const constants = {
  START_FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
} as Constants;

const application: Application = {
  services,
  ui,
  components,
  constants,
  state,
  stepModules,
  hooks,
  utils,
  model,
  register: register as Application['register'],
  resolveDeferredRegister: resolveDeferredRegister as Function,
};

export {
  application as default,
  services,
  components,
  ui,
  constants,
  hooks,
  state,
  utils,
  model,
  stepModules,
};
