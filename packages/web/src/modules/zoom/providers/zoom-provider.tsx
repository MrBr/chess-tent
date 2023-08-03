import React, { useEffect, useState, useRef } from 'react';
import { hooks } from '@application';
import { Components } from '@types';
import { ZoomRole } from '@chess-tent/models';

import { zoomAuthorize, generateSignature } from '../requests';
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
  } = useApi(zoomAuthorize);
  const {
    fetch: signatureFetch,
    response: signatureResponse,
    loading: signatureLoading,
  } = useApi(generateSignature);

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
      authResponse
    ) {
      return;
    }

    authFetch({ code: zoomContextState.authCode, redirectUri });
  }, [authFetch, authLoading, authResponse, redirectUri, zoomContextState]);

  useEffect(() => {
    if (
      !zoomContextState.meetingNumber ||
      signatureResponse ||
      signatureLoading
    ) {
      return;
    }

    signatureFetch({
      meetingNumber: zoomContextState.meetingNumber,
      role: zoomContextState.role,
    });
  }, [signatureFetch, signatureResponse, signatureLoading, zoomContextState]);

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
