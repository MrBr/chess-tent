import { service } from '@application';
import { Service } from '@types';

import { transformS3UrlToS3ProxyUrl } from './utils';

export const generatePutFileSignedUrl: Service['generatePutFileSignedUrl'] =
  async options => {
    const signedUrl = await service.fileStorage.getSignedUrlPromise(
      'putObject',
      {
        Bucket: process.env.AWS_IMAGES_BUCKET,
        ...options,
      },
    );
    return transformS3UrlToS3ProxyUrl(signedUrl);
  };
