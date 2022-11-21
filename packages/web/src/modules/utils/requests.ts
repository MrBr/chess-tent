import { requests } from '@application';

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
