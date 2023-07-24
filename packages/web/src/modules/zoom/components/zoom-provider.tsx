import React, { useEffect, useState, useRef, RefObject } from 'react';
import { hooks } from '@application';
import { Components } from '@types';
import { User, ZoomRole } from '@chess-tent/models';

import { zoomAuthorize, generateSignature } from '../requests';
import { ZoomConnectionStatus, ZoomContext, ZoomContextType } from '../context';

const { useApi, useQuery } = hooks;

interface InitialContextData {
  meetingNumber: string | undefined;
  user: User;
  code: string | undefined;
  redirectUri: string;
  zoomSDKElementRef: RefObject<HTMLElement>;
}

const createInitialContext = ({
  meetingNumber,
  user,
  code,
  redirectUri,
  zoomSDKElementRef,
}: InitialContextData) => ({
  userSignature: null,
  hostUserZakToken: undefined,
  meetingNumber: meetingNumber?.replaceAll(' ', ''),
  username: user.nickname,
  password: null,
  role: user?.coach ? ZoomRole.Host : ZoomRole.Guest,
  authCode: code,
  redirectUri,
  updateContext: () => {},
  resetContext: () => {},
  connectionStatus: ZoomConnectionStatus.NOT_CONNECTED,
  zoomSDKElementRef,
});

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
      (!zoomContextState.authCode && zoomContextState.role === ZoomRole.Host) ||
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
