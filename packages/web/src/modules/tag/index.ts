import application from '@application';
import './requests';
import { tagSchema } from './model';

application.model.tagSchema = tagSchema;

application.register(
  () => import('./hooks'),
  module => {
    application.hooks.useTags = module.useTags;
  },
);

application.register(() => import('./state/reducer'));

application.register(
  () => import('./components/tags-select'),
  module => {
    application.components.TagsSelect = module.default;
  },
);
