import application from '@application';
import { addTagService, findTags } from './service';

import './routes';

application.service.addTag = addTagService;
application.service.findTags = findTags;
