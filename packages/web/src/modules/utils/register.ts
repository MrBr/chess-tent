import application from '@application';
import { v4 as uuid } from 'uuid';
import {
  useComponentState,
  useComponentStateSilent,
  useIsMobile,
} from './hooks';
import { getEntitySchema, getTypeSchema } from './model';
import { mediaQueryEnhancer } from './enhancers';

application.utils.generateIndex = uuid;
application.utils.rightMouse = (f: Function) => (e: MouseEvent) =>
  e.button === 2 && f(e);
application.utils.stopPropagation = e => e.stopPropagation();

application.utils.getEntitySchema = getEntitySchema;
application.utils.getTypeSchema = getTypeSchema;

application.utils.mediaQueryEnhancer = mediaQueryEnhancer;

application.hooks.useComponentStateSilent = useComponentStateSilent;
application.hooks.useComponentState = useComponentState;
application.hooks.useIsMobile = useIsMobile;

application.register(
  () => import('./hoc'),
  module => {
    application.hoc.withMobile = module.withMobile;
  },
);
