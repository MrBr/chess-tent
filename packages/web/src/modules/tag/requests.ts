import { services, requests } from '@application';
import { Requests } from '@types';

const getAllTags = services.createRequest<Requests['tags']>('GET', '/tags');
const findTags = services.createRequest<Requests['findTags']>('POST', '/tags');

requests.findTags = findTags;
requests.tags = getAllTags;
