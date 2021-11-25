export const transformS3UrlToS3ProxyUrl = (url: string) => {
  const segments = url.split('.com/');
  segments[0] = process.env.AWS_PROXY_URL as string;
  return segments.join('');
};
