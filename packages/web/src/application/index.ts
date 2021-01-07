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
  Pages,
  Requests,
  Socket,
  HOC,
  Context,
} from '@types';

const services = createNamespace({}) as Services;
const context = createNamespace({}) as Context;
const components = createNamespace({}) as Components;
const pages = createNamespace({}) as Pages;
const requests = createNamespace({}) as Requests;
const ui = createNamespace({}) as UI;
const hooks = createNamespace({}) as Hooks;
const state = createNamespace({
  actions: createNamespace({}),
  selectors: createNamespace({}),
}) as State;
const utils = createNamespace({}) as Utils;
const socket = createNamespace({}) as Socket;
const model = createNamespace({}) as Model;
const hoc = createNamespace({}) as HOC;
const stepModules = createNamespace({}) as StepModules;
const constants = createNamespace({
  START_FEN: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  KINGS_FEN: '4k3/8/8/8/8/8/8/4K3 w - - 0 1',
  MOBILE_ROOT_KEY: 'mobile-root',
  MAX_BOARD_SIZE: 670,
}) as Constants;

const application: Application = createNamespace({
  context,
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
  pages,
  requests,
  socket,
  hoc,
}) as Application;

export {
  application as default,
  hoc,
  socket,
  services,
  components,
  ui,
  requests,
  constants,
  hooks,
  state,
  utils,
  model,
  stepModules,
  pages,
  context,
};
