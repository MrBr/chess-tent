import { services, requests } from '@application';
import { Requests } from '@types';

const contact = services.createRequest<Requests['contact']>('POST', '/contact');

requests.contact = contact;
