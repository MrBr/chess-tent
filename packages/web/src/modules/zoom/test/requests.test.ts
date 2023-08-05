import { renderHook, act } from '@testing-library/react';
import application from '@application';
import { ZoomResponse } from '@chess-tent/types';

const { hooks, requests } = application;

describe('Zoom requests', () => {
  it('Zoom request should return set values from request', async () => {
    const { useApi } = hooks;
    let { zoomAuthorize } = requests;

    zoomAuthorize = jest.fn(() =>
      Promise.resolve<ZoomResponse>({ data: 'data', error: null }),
    );

    const { result } = renderHook(() => useApi(zoomAuthorize));

    await act(async () =>
      result.current.fetch({
        redirectUri: '',
        code: '',
      }),
    );

    expect(result.current.response?.data).toBe('data');
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  it('Zoom request should return error', async () => {
    let { useApi } = hooks;
    let { zoomAuthorize } = requests;

    zoomAuthorize = jest.fn(() =>
      Promise.resolve<ZoomResponse>({ data: '', error: 'error' }),
    );

    const { result } = renderHook(() => useApi(zoomAuthorize));

    await act(async () =>
      result.current.fetch({
        redirectUri: '',
        code: '',
      }),
    );

    expect(result.current.error).toBe('error');
  });

  it('Zoom request should return the null after reset', async () => {
    let { useApi } = hooks;
    let { zoomAuthorize } = requests;

    zoomAuthorize = jest.fn(() =>
      Promise.resolve<ZoomResponse>({ data: 'data', error: null }),
    );

    const { result } = renderHook(() => useApi(zoomAuthorize));

    await act(async () =>
      result.current.fetch({
        redirectUri: '',
        code: '',
      }),
    );

    await act(async () => result.current.reset());

    expect(result.current.response).toBe(null);
  });
});
