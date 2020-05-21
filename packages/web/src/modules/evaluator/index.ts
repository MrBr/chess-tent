import application from '@application';

application.register(() => {
  application.components.Evaluator = require('./evaluator').default;
});
