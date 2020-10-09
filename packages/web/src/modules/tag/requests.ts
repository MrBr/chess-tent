import { services, requests } from '@application';
import { TagsResponse } from '@types';

const getAllTags = services.createRequest<undefined, TagsResponse>(
  'GET',
  '/tags',
);
const findTags = services.createRequest<string, TagsResponse>('POST', '/tags');

requests.findTags = findTags;
requests.tags = getAllTags;
