import application from '@application';

application.register(
  () => import('./components/evaluation-bar'),
  module => {
    application.components.EvaluationBar = module.default;
  },
);

application.register(
  () => import('./components/evaluation-lines'),
  module => {
    application.components.EvaluationLines = module.default;
  },
);
application.register(
  () => import('./components/evaluator'),
  module => {
    application.components.Evaluator = module.default;
  },
);

application.register(
  () => import('./service'),
  module => {
    application.services.getEvaluationBestMove = module.getBestMove;
    application.services.getEvaluationPonderMove = module.getPonderMove;
  },
);
