import application from '@application';
import './routes';
import { addMentor } from './middleware';

application.middleware.addMentor = addMentor;
