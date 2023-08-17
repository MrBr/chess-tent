import { ZoomConnectionStatus } from '@chess-tent/models';
import { isZoomConnectionInProgress, authorizeZoom } from '../services';

describe('Zoom services', () => {
  it('Should return appropriate connection status', () => {
    const connectedResult = isZoomConnectionInProgress(
      ZoomConnectionStatus.CONNECTED,
    );
    expect(connectedResult).toBeTruthy();

    const connectingResult = isZoomConnectionInProgress(
      ZoomConnectionStatus.CONNECTING,
    );
    expect(connectingResult).toBeTruthy();

    const notConnectedResult = isZoomConnectionInProgress(
      ZoomConnectionStatus.NOT_CONNECTED,
    );
    expect(notConnectedResult).toBeFalsy();
  });

  it('Should redirect to zoom authorize page', () => {
    const redirectUri = 'test-uri';
    const url =
      'https://zoom.us/oauth/authorize?response_type=code&client_id=' +
      process.env.REACT_APP_ZOOM_CLIENT_ID +
      '&redirect_uri=' +
      redirectUri;

    const openMock = jest.fn();
    window.open = openMock;

    authorizeZoom(redirectUri);

    expect(openMock).toHaveBeenCalledWith(url, '_parent');
    openMock.mockRestore();
  });
});
