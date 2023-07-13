import React, { useEffect, useCallback, useState, ChangeEvent } from 'react';
import { hooks, ui } from '@application';
import { Components } from '@types';

import { zoomAuthorize, generateSignature } from '../requests';
import { ZoomContext, ZoomContextType, Role } from '../context';
import { authorizeZoom } from '../services';
import ZoomActivityView from './zoom-activity-view';

const { useApi, useQuery } = hooks;
const { Button, Container, Input, Row, Col } = ui;

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
  const generateSignatureApi = useApi(generateSignature);

  useEffect(() => {
    if (
      code &&
      zoomContextState.role &&
      !generateSignatureApi.response &&
      !generateSignatureApi.loading &&
      !zoomAuthorizeApi.response &&
      !zoomAuthorizeApi.loading
    ) {
      zoomAuthorizeApi.fetch({ code, redirectUri });
      generateSignatureApi.fetch({
        meetingNumber: zoomContextState.meetingNumber,
        role: zoomContextState.role as number,
      });
    }
  }, [
    code,
    generateSignatureApi,
    zoomAuthorizeApi,
    redirectUri,
    zoomContextState,
  ]);

  useEffect(() => {
    if (
      !generateSignatureApi.response?.data ||
      !code ||
      !zoomAuthorizeApi.response?.data
    ) {
      return;
    }

    if (zoomContextState.userSignature) {
      return;
    }

    setZoomContextState(prevState => ({
      ...prevState,
      userSignature: generateSignatureApi.response.data,
      hostUserZakToken: zoomAuthorizeApi.response.data,
    }));
  }, [
    generateSignatureApi,
    code,
    zoomAuthorizeApi,
    zoomContextState.userSignature,
  ]);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setZoomContextState(prevState => ({
        ...prevState,
        [event.target.name]: event.target.value,
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
                      onClick={() => handleJoinButtonClicked(1)}
                    >
                      Join as host
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      size="small"
                      onClick={() => handleJoinButtonClicked(0)}
                    >
                      Join as guest
                    </Button>
                  </Col>
                </Row>
              </>
            )
          )}
        </>

        {zoomContextState.userSignature && <ZoomActivityView />}
      </Container>
    </ZoomContext.Provider>
  );
};

export default ZoomProvider;
