import application from '@application';
import { addMentor } from './middleware';

application.middleware.addMentor = addMentor;

application.register(() => import('./routes'));
