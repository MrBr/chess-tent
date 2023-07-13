import React, { useEffect, useCallback, useState, ChangeEvent } from 'react';
import { hooks, ui } from '@application';
import { Components } from '@types';

import { zoomAuthorize, generateSignature } from '../requests';
import { ZoomContext, ZoomContextType, Role } from '../context';
import { authorizeZoom } from '../services';
import ZoomActivityView from './zoom-activity-view';

const { useApi, useQuery } = hooks;
const { Button, Container, Input, Row, Col, Spinner } = ui;

const ZoomProvider: Components['ZoomProvider'] = ({ redirectUri }) => {
  const [zoomContextState, setZoomContextState] = useState<ZoomContextType>({
    userSignature: '',
    hostUserZakToken: null,
    meetingNumber: '',
    username: '',
    password: '',
    role: null,
  });

  const { code } = useQuery<{ code?: string; path?: string }>();
  const zoomAuthorizeApi = useApi(zoomAuthorize);
  const zoomSignatureApi = useApi(generateSignature);

  useEffect(() => {
    if (
      code &&
      zoomContextState.role !== null &&
      !zoomSignatureApi.response &&
      !zoomSignatureApi.loading
    ) {
      if (zoomContextState.role === Role.Host) {
        zoomAuthorizeApi.fetch({ code, redirectUri });
      }

      zoomSignatureApi.fetch({
        meetingNumber: zoomContextState.meetingNumber,
        role: zoomContextState.role as number,
      });
    }
  }, [code, zoomSignatureApi, zoomAuthorizeApi, redirectUri, zoomContextState]);

  useEffect(() => {
    if (
      !zoomSignatureApi.response?.data ||
      !code ||
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

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setZoomContextState(prevState => ({
        ...prevState,
        [event.target.name]:
          event.target.name === 'meetingNumber'
            ? event.target.value.replaceAll(' ', '')
            : event.target.value,
      }));
    },
    [setZoomContextState],
  );

  const handleJoinButtonClicked = useCallback(
    (role: Role) => {
      setZoomContextState(prevState => ({
        ...prevState,
        role,
      }));
    },
    [setZoomContextState],
  );

  return (
    <ZoomContext.Provider value={zoomContextState}>
      <Container className="text-center">
        <>
          {!code ? (
            <Button onClick={() => authorizeZoom(redirectUri)}>
              Authorize Zoom
            </Button>
          ) : (
            !zoomContextState.userSignature && (
              <>
                <Input
                  size="small"
                  type="text"
                  name="meetingNumber"
                  placeholder="Meeting number"
                  onChange={handleInputChange}
                  className="mb-3"
                />
                <Input
                  size="small"
                  type="text"
                  name="username"
                  placeholder="Meeting username"
                  onChange={handleInputChange}
                  className="mb-3"
                />
                <Input
                  size="small"
                  type="text"
                  name="password"
                  placeholder="Meeting password (if any)"
                  onChange={handleInputChange}
                  className="mb-3"
                />
                <Row className="text-center">
                  <Col>
                    <Button
                      size="small"
                      onClick={() => handleJoinButtonClicked(Role.Host)}
                    >
                      Join as host
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      size="small"
                      onClick={() => handleJoinButtonClicked(Role.Guest)}
                    >
                      Join as guest
                    </Button>
                  </Col>
                </Row>
              </>
            )
          )}
        </>
        {zoomAuthorizeApi.loading ||
          (zoomSignatureApi.loading && <Spinner animation="grow" />)}
        {zoomContextState.userSignature && <ZoomActivityView />}
      </Container>
    </ZoomContext.Provider>
  );
};

export default ZoomProvider;
