import React, { useEffect, useState, useRef } from 'react';
import { hooks, requests } from '@application';
import { Components } from '@types';
import { ZoomRole } from '@chess-tent/models';

import { ZoomContext, ZoomContextType, createInitialContext } from '../context';

const { useApi, useQuery } = hooks;

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
    fetch: signatureFetch,
    response: signatureResponse,
    loading: signatureLoading,
    error: signatureError,
  } = useApi(requests.zoomSignature);

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
    if (
      !signatureResponse?.data ||
      zoomContextState.userSignature ||
      (!authResponse?.data && zoomContextState.role === ZoomRole.Host)
    ) {
      return;
    }

    setZoomContextState(prevState => ({
      ...prevState,
      userSignature: signatureResponse.data,
      hostUserZakToken: authResponse?.data,
    }));
  }, [signatureResponse, authResponse, zoomContextState]);

  return (
    <ZoomContext.Provider value={zoomContextState}>
      {children}
    </ZoomContext.Provider>
  );
};

export default ZoomProvider;
