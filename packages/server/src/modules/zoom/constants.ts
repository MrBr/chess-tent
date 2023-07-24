export const Authorization = Buffer.from(
  `${process.env.ZOOM_MEETING_SDK_KEY_OR_CLIENT_ID}:${process.env.ZOOM_MEETING_SDK_SECRET_OR_CLIENT_SECRET}`,
).toString('base64');
