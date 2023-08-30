import './routes';
import './defaults';
import application from '@application';
import { addTagService } from './service';

application.service.addTag = addTagService;
