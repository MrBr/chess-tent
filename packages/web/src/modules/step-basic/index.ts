import application, {
  services,
  ui,
  hooks,
  components,
  state,
} from '@application';

application.register(
  () => [
    services.recreateFenWithMoves,
    hooks.useDispatchBatched,
    components.Chessboard,
    components.Action,
    ui.Confirm,
    ui.Button,
    state.actions.updateStepState,
  ],
  () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    application.stepModules.registerStep(require('./step').default);
  },
);
