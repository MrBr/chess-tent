import { renderHook, act } from '@testing-library/react';
import application from '@application';

import { getCustomRequest } from '../../../application/test/zoom/utils';

const { hooks, requests } = application;

describe('Zoom requests', () => {
  it('Zoom request should return set values from request', async () => {
    const { useApi } = hooks;
    let { zoomAuthorize } = requests;

    zoomAuthorize = getCustomRequest({ data: 'data', error: null });

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
    const { useApi } = hooks;
    let { zoomAuthorize } = requests;

    zoomAuthorize = getCustomRequest({ data: '', error: 'error' });

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
    const { useApi } = hooks;
    let { zoomAuthorize } = requests;

    zoomAuthorize = getCustomRequest({ data: 'data', error: null });

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
