import application from '@application';

application.register(
  () => import('./components/evaluation'),
  module => {
    application.components.Evaluation = module.default;
  },
);

application.register(
  () => import('./service'),
  module => {
    application.services.getEvaluationBestMove = module.getBestMove;
    application.services.getEvaluationPonderMove = module.getPonderMove;
  },
);
