import application from '@application';
import { v4 as uuid } from 'uuid';
import { saveAs } from 'file-saver';
import {
  useComponentState,
  useComponentStateSilent,
  useInputStateUpdate,
  useOutsideClick,
  usePrompt,
  useShowOnActive,
  useValidation,
} from './hooks';
import { getEntitySchema, getTypeSchema } from './model';
import {
  getAppUrl,
  getCountries,
  getCountryByCode,
  getDiff,
  getLanguages,
  noop,
  noopNoop,
} from './utils';
import {
  rightMouse,
  stopPropagation,
  isElementInViewport,
  isInputTypeElement,
  createKeyboardNavigationHandler,
  getFileImageDimensions,
  autosizeTextarea,
} from './html';

application.utils.generateIndex = uuid;

application.utils.rightMouse = rightMouse;
application.utils.stopPropagation = stopPropagation;
application.utils.isElementInViewport = isElementInViewport;
application.utils.isInputTypeElement = isInputTypeElement;
application.utils.autosizeTextarea = autosizeTextarea;
application.utils.getFileImageDimensions = getFileImageDimensions;
application.utils.createKeyboardNavigationHandler =
  createKeyboardNavigationHandler;

application.utils.getEntitySchema = getEntitySchema;
application.utils.getTypeSchema = getTypeSchema;

application.utils.downloadAs = saveAs;

application.utils.getDiff = getDiff;

application.utils.noop = noop;
application.utils.noopNoop = noopNoop;

application.utils.getAppUrl = getAppUrl;

application.utils.getLanguages = getLanguages;
application.utils.getCountries = getCountries;
application.utils.getCountryByCode = getCountryByCode;

application.hooks.useShowOnActive = useShowOnActive;
application.hooks.useComponentStateSilent = useComponentStateSilent;
application.hooks.useComponentState = useComponentState;
application.hooks.useOutsideClick = useOutsideClick;
application.hooks.usePrompt = usePrompt;
application.hooks.useInputStateUpdate = useInputStateUpdate;
application.hooks.useValidation = useValidation;
