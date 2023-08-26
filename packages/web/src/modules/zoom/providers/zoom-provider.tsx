import React, { useEffect, useState, useRef, useCallback } from 'react';
import { hooks, requests } from '@application';
import { Components, ZoomContext as ZoomContextType } from '@types';
import { ZoomRole } from '@chess-tent/models';

import { createInitialContext, ZoomContext } from '../context';

const { useApi, useQuery, useLocation, useHistory } = hooks;

const ZoomProvider: Components['ZoomProvider'] = ({
  redirectUri,
  user,
  meetingNumber,
  children,
}) => {
  const {
    fetch: authFetch,
    response: authResponse,
    loading: authLoading,
    error: authError,
  } = useApi(requests.zoomAuthorize);
  const {
    fetch: zakTokenFetch,
    response: zakTokenResponse,
    loading: zakTokenLoading,
    error: zakTokenError,
  } = useApi(requests.zoomZakToken);
  const {
    fetch: signatureFetch,
    response: signatureResponse,
    loading: signatureLoading,
    error: signatureError,
  } = useApi(requests.zoomSignature);
  const location = useLocation();
  const history = useHistory();

  const { code } = useQuery<{ code?: string }>();
  const zoomSDKElementRef = useRef<HTMLElement>(null);

  const [zoomContextState, setZoomContextState] = useState<ZoomContextType>({
    ...createInitialContext({
      meetingNumber,
      user,
      code,
      redirectUri,
      zoomSDKElementRef,
    }),
    resetContext: () =>
      setZoomContextState(({ resetContext, updateContext }) => ({
        ...createInitialContext({
          meetingNumber,
          user,
          code,
          redirectUri,
          zoomSDKElementRef,
        }),
        resetContext,
        updateContext,
      })),
    updateContext: (data: Partial<ZoomContextType>) =>
      setZoomContextState(prevState => ({
        ...prevState,
        ...data,
      })),
  });

  const removeQueryCode = useCallback(() => {
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.has('code')) {
      queryParams.delete('code');
      history.replace({
        search: queryParams.toString(),
      });
    }
  }, [history, location.search]);

  useEffect(() => {
    if (
      zoomContextState.role !== ZoomRole.Host ||
      zoomContextState.hostUserZakToken ||
      zakTokenLoading ||
      zakTokenResponse ||
      zakTokenError
    ) {
      return;
    }
    zakTokenFetch();
  }, [
    zoomContextState,
    zakTokenError,
    zakTokenLoading,
    zakTokenResponse,
    zakTokenFetch,
  ]);

  useEffect(() => {
    if (
      zoomContextState.role !== ZoomRole.Host ||
      !zoomContextState.authCode ||
      authLoading ||
      authResponse ||
      authError
    ) {
      return;
    }

    authFetch({ code: zoomContextState.authCode, redirectUri });
  }, [
    authFetch,
    authLoading,
    authResponse,
    authError,
    redirectUri,
    zoomContextState,
  ]);

  useEffect(() => {
    if (
      !zoomContextState.meetingNumber ||
      signatureResponse ||
      signatureLoading ||
      signatureError
    ) {
      return;
    }

    signatureFetch({
      meetingNumber: zoomContextState.meetingNumber,
      role: zoomContextState.role,
    });
  }, [
    signatureFetch,
    signatureResponse,
    signatureLoading,
    signatureError,
    zoomContextState,
  ]);

  useEffect(() => {
    if (zakTokenResponse || zakTokenError) {
      setZoomContextState(prevState => ({
        ...prevState,
        hostUserZakToken: zakTokenResponse?.data,
        zakTokenRequested: true,
      }));
    }
  }, [zakTokenResponse, zakTokenError]);

  useEffect(() => {
    setZoomContextState(prevState => ({
      ...prevState,
      hostUserZakToken: authResponse?.data,
    }));

    removeQueryCode();
  }, [authResponse, removeQueryCode]);

  useEffect(() => {
    if (!signatureResponse?.data || zoomContextState.userSignature) {
      return;
    }

    setZoomContextState(prevState => ({
      ...prevState,
      userSignature: signatureResponse.data,
    }));
  }, [signatureResponse, authResponse, zoomContextState, zakTokenResponse]);

  return (
    <ZoomContext.Provider value={zoomContextState}>
      {children}
    </ZoomContext.Provider>
  );
};

export default ZoomProvider;
