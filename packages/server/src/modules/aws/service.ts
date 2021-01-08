import { service } from '@application';

export const getSignedUrl = (options: any) =>
  service.fileStorage.getSignedUrlPromise('putObject', options);
