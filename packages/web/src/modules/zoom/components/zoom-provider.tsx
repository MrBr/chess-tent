import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { hooks } from '@application';
import { Components } from '@types';

import { zoomAuthorize, generateSignature } from '../requests';
import { ZoomContext, ZoomContextType, Role } from '../context';

const { useApi, useQuery } = hooks;

const ZoomProvider: Components['ZoomProvider'] = ({
  redirectUri,
  user,
  meetingNumber,
  children,
}) => {
  const { fetch: authFetch, response: authResponse } = useApi(zoomAuthorize);
  const {
    fetch: signatureFetch,
    response: signatureResponse,
    loading: signatureLoading,
  } = useApi(generateSignature);

  const { code } = useQuery<{ code?: string }>();

  const initialState: ZoomContextType = useMemo(
    () => ({
      userSignature: null,
      hostUserZakToken: undefined,
      meetingNumber: meetingNumber?.replaceAll(' ', ''),
      username: user.nickname,
      password: null,
      role: user?.coach ? Role.Host : Role.Guest,
      authCode: code,
      redirectUri,
      updateContext: () => {},
      resetContext: () => {},
      isOnCall: false,
    }),
    [user, redirectUri, code, meetingNumber],
  );

  const [zoomContextState, setZoomContextState] =
    useState<ZoomContextType>(initialState);

  const resetContext = useCallback(() => {
    if (zoomContextState.userSignature === initialState.userSignature) {
      return;
    }

    setZoomContextState(initialState);
  }, [initialState, zoomContextState.userSignature]);

  useEffect(() => {
    setZoomContextState(prevState => ({
      ...prevState,
      updateContext: setZoomContextState,
      resetContext,
    }));
  }, [resetContext]);

  useEffect(() => {
    if (
      !zoomContextState.meetingNumber ||
      signatureResponse ||
      signatureLoading
    ) {
      return;
    }

    if (!zoomContextState.authCode && zoomContextState.role === Role.Host) {
      return;
    } else if (zoomContextState.authCode) {
      authFetch({ code: zoomContextState.authCode, redirectUri });
    }

    signatureFetch({
      meetingNumber: zoomContextState.meetingNumber,
      role: zoomContextState.role as number,
    });
  }, [
    signatureFetch,
    signatureResponse,
    signatureLoading,
    authFetch,
    redirectUri,
    zoomContextState,
  ]);

  useEffect(() => {
    if (
      !signatureResponse?.data ||
      zoomContextState.userSignature ||
      (!authResponse?.data && zoomContextState.role === Role.Host)
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
