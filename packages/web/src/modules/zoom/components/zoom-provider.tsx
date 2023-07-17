import React, { useEffect, useState } from 'react';
import { hooks } from '@application';
import { Components } from '@types';

import { zoomAuthorize, generateSignature } from '../requests';
import { ZoomContext, ZoomContextType, Role } from '../context';

const { useApi, useQuery } = hooks;

const ZoomProvider: Components['ZoomProvider'] = ({
  redirectUri,
  user,
  children,
}) => {
  const [zoomContextState, setZoomContextState] = useState<ZoomContextType>({
    userSignature: '',
    hostUserZakToken: null,
    meetingNumber: '',
    username: user.nickname,
    password: '',
    role: user?.coach ? Role.Host : Role.Guest,
    authCode: undefined,
    redirectUri,
    updateContext: () => {},
  });

  const { code } = useQuery<{ code?: string; path?: string }>();

  useEffect(() => {
    setZoomContextState(prevState => ({
      ...prevState,
      authCode: code,
      redirectUri: redirectUri,
      updateContext: setZoomContextState,
    }));
  }, [code, redirectUri]);

  const zoomAuthorizeApi = useApi(zoomAuthorize);
  const zoomSignatureApi = useApi(generateSignature);

  useEffect(() => {
    if (
      zoomContextState.meetingNumber === '' ||
      zoomSignatureApi.response ||
      zoomSignatureApi.loading
    ) {
      return;
    }

    if (!code && zoomContextState.role === Role.Host) {
      return;
    } else if (code) {
      zoomAuthorizeApi.fetch({ code, redirectUri });
    }

    zoomSignatureApi.fetch({
      meetingNumber: zoomContextState.meetingNumber,
      role: zoomContextState.role as number,
    });
  }, [code, zoomSignatureApi, zoomAuthorizeApi, redirectUri, zoomContextState]);

  useEffect(() => {
    if (
      !zoomSignatureApi.response?.data ||
      zoomContextState.userSignature ||
      (!zoomAuthorizeApi.response?.data && zoomContextState.role === Role.Host)
    ) {
      return;
    }
    setZoomContextState(prevState => ({
      ...prevState,
      userSignature: zoomSignatureApi.response.data,
      hostUserZakToken: zoomAuthorizeApi.response?.data,
    }));
  }, [zoomSignatureApi, code, zoomAuthorizeApi, zoomContextState]);

  return (
    <ZoomContext.Provider value={zoomContextState}>
      {children}
    </ZoomContext.Provider>
  );
};

export default ZoomProvider;
