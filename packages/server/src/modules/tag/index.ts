import application from '@application';
import { addTagService } from './service';

import './routes';

application.service.addTag = addTagService;
