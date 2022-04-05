import { requests, services } from '@application';
import { Requests } from '@types';

requests.signImageUrl = services.createRequest<Requests['signImageUrl']>(
  'POST',
  '/sign-image-url',
);

requests.uploadImage = (signedImageUrl, file) =>
  fetch(signedImageUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  }).then(
    () => signedImageUrl.split('?')[0], // if the response is a JSON object
  );
