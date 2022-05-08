import application from '@application';
import { v4 as uuid } from 'uuid';
import { saveAs } from 'file-saver';
import {
  useComponentState,
  useComponentStateSilent,
  useOutsideClick,
  usePrompt,
} from './hooks';
import { getEntitySchema, getTypeSchema } from './model';
import { dateToDatetimeLocal, getDiff, noop, noopNoop } from './utils';

application.utils.generateIndex = uuid;
application.utils.rightMouse = (f: Function) => (e: MouseEvent) =>
  e.button === 2 && f(e);
application.utils.stopPropagation = e => e.stopPropagation();
application.utils.dateToDatetimeLocal = dateToDatetimeLocal;

application.utils.getEntitySchema = getEntitySchema;
application.utils.getTypeSchema = getTypeSchema;

application.utils.downloadAs = saveAs;

application.utils.getDiff = getDiff;

application.utils.noop = noop;
application.utils.noopNoop = noopNoop;

application.hooks.useComponentStateSilent = useComponentStateSilent;
application.hooks.useComponentState = useComponentState;
application.hooks.useOutsideClick = useOutsideClick;
application.hooks.usePrompt = usePrompt;
