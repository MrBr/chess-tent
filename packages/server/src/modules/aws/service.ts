import { service } from '@application';

import { transformS3UrlToS3ProxyUrl } from './utils';

export const getSignedUrl = async (options: any) => {
  const signedUrl = await service.fileStorage.getSignedUrlPromise(
    'putObject',
    options,
  );
  return transformS3UrlToS3ProxyUrl(signedUrl);
};
