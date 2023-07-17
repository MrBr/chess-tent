import React, { useEffect, useState } from 'react';
import { hooks, ui } from '@application';
import { Components } from '@types';

import { zoomAuthorize, generateSignature } from '../requests';
import { ZoomContext, ZoomContextType, Role } from '../context';
import ZoomActivityView from './zoom-activity-view';
import HostControl from './controls/host-control';
import GuestControl from './controls/guest-control';

const { useApi, useQuery } = hooks;
const { Container, Spinner } = ui;

const ZoomProvider: Components['ZoomProvider'] = ({ redirectUri, user }) => {
  const [zoomContextState, setZoomContextState] = useState<ZoomContextType>({
    userSignature: '',
    hostUserZakToken: null,
    meetingNumber: '',
    username: user.nickname,
    password: '',
    role: user?.coach ? Role.Host : Role.Guest,
  });

  const { code } = useQuery<{ code?: string; path?: string }>();
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
      <Container className="text-center">
        <>
          {!zoomContextState.userSignature &&
            (user?.coach ? (
              <HostControl
                isAuthorized={!!code}
                redirectUri={redirectUri}
                onJoin={setZoomContextState}
              />
            ) : (
              <GuestControl onJoin={setZoomContextState} />
            ))}
        </>
        {zoomAuthorizeApi.loading ||
          (zoomSignatureApi.loading && <Spinner animation="grow" />)}
        {zoomContextState.userSignature && (
          <ZoomActivityView resetContext={resetContext} />
        )}
      </Container>
    </ZoomContext.Provider>
  );
};

export default ZoomProvider;
