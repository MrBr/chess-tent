import application from '@application';
import './requests';
import { tagSchema } from './model';
import { TYPE_TAG } from '@chess-tent/models';

application.model.tagSchema = tagSchema;

application.register(
  () => import('./state/hooks'),
  module => {
    application.hooks.useTags = module.useTags;
  },
);

application.register(
  () => import('./state/reducer'),
  module => {
    application.state.registerEntityReducer(TYPE_TAG, module.reducer);
  },
);

application.register(
  () => import('./components/tags-select'),
  module => {
    application.components.TagsSelect = module.default;
  },
);
