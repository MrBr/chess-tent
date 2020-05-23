import { register, init, createNamespace } from 'core-module';
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
  UI,
} from '@types';

const services = createNamespace({}) as Services;
const components = createNamespace({}) as Components;
const ui = createNamespace({}) as UI;
const hooks = createNamespace({}) as Hooks;
const state = createNamespace({
  actions: createNamespace({}),
  selectors: createNamespace({}),
}) as State;
const utils = createNamespace({}) as Utils;
const model = createNamespace({}) as Model;
const stepModules = createNamespace({}) as StepModules;
const constants = createNamespace({
  START_FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
}) as Constants;

const application: Application = createNamespace({
  services,
  ui,
  components,
  constants,
  state,
  stepModules,
  hooks,
  utils,
  model,
  register: register,
  init: init,
}) as Application;

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
