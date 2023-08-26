import { renderHook, act } from '@testing-library/react';
import application from '@application';

import { mockDataResponse } from '../../../application/test/zoom/utils';

const { hooks, requests } = application;

describe('Zoom requests', () => {
  it('should return set values from request', async () => {
    const { useApi } = hooks;
    let { zoomAuthorize } = requests;

    zoomAuthorize = mockDataResponse({ data: 'data', error: null });

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

  it('should return error', async () => {
    const { useApi } = hooks;
    let { zoomAuthorize } = requests;

    zoomAuthorize = mockDataResponse({ data: '', error: 'error' });

    const { result } = renderHook(() => useApi(zoomAuthorize));

    await act(async () =>
      result.current.fetch({
        redirectUri: '',
        code: '',
      }),
    );

    expect(result.current.error).toBe('error');
  });

  it('should return the null after reset', async () => {
    const { useApi } = hooks;
    let { zoomAuthorize } = requests;

    zoomAuthorize = mockDataResponse({ data: 'data', error: null });

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

  it('should return zak token if user is already authorized', async () => {
    const { useApi } = hooks;
    let { zoomZakToken } = requests;

    zoomZakToken = mockDataResponse({ data: 'zak-token', error: null });

    const { result } = renderHook(() => useApi(zoomZakToken));

    await act(async () => result.current.fetch());

    expect(result.current.response?.data).toBe('zak-token');
  });

  it('should return zak token not found if user is not authorized', async () => {
    const { useApi } = hooks;
    let { zoomZakToken } = requests;

    zoomZakToken = mockDataResponse({ data: '', error: 'Zak token not found' });

    const { result } = renderHook(() => useApi(zoomZakToken));

    await act(async () => result.current.fetch());

    expect(result.current.error).toBe('Zak token not found');
  });
});
