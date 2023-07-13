export const authorizeZoom = (redirectUri: string) => {
  const url =
    'https://zoom.us/oauth/authorize?response_type=code&client_id=' +
    process.env.REACT_APP_ZOOM_CLIENT_ID +
    '&redirect_uri=' +
    redirectUri;
  window.open(url, '_parent');
};
