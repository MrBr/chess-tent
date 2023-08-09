import React from 'react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import application from '@application';

import {
  renderWithProvider,
  getElementByRegex,
  getContextInitialData,
  mockDataResponse,
  mockEmptyDataResponse,
} from './utils';
import { ZoomContext, ZoomContextType } from '../../../modules/zoom/context';

beforeAll(() => application.init());

const { fixtures } = application;

describe('Zoom Provider', () => {
  it('ZoomContext should have correct initial values', async () => {
    const { student: user } = fixtures.users;
    const { requests } = application;

    requests.zoomSignature = mockEmptyDataResponse();
    requests.zoomAuthorize = mockEmptyDataResponse();

    const initialContext = getContextInitialData(user);

    renderWithProvider(
      <ZoomContext.Consumer>
        {(value: ZoomContextType) =>
          Object.keys(value).map(key => (
            <span key={key}>
              {`${key.toString()}: ${value[
                key as keyof ZoomContextType
              ]?.toString()}`}
            </span>
          ))
        }
      </ZoomContext.Consumer>,
      { ...initialContext, user },
    );

    expect(await getElementByRegex(/userSignature/)).toBe(
      'userSignature: undefined',
    );
    expect(await getElementByRegex(/hostUserZakToken/)).toBe(
      'hostUserZakToken: undefined',
    );
    expect(
      await screen.findByText(
        'meetingNumber: ' + initialContext?.meetingNumber,
      ),
    ).toBeInTheDocument();
    expect(await getElementByRegex(/username/)).toBe(
      'username: ' + user.nickname,
    );
    expect(await getElementByRegex(/password/)).toBe('password: undefined');
    expect(await getElementByRegex(/role/)).toBe(
      'role: ' + initialContext.role,
    );
    expect(await getElementByRegex(/authCode/)).toBe(
      'authCode: ' + initialContext.authCode,
    );
    expect((await screen.findAllByText(/redirectUri/)).length).toBeGreaterThan(
      0,
    );
    expect(await getElementByRegex(/connectionStatus/)).toBe(
      'connectionStatus: ' + initialContext.connectionStatus,
    );
  });

  it('ZoomContext should update signature and auth data correctly after API requests when user is coach', async () => {
    const { coach: user } = fixtures.users;
    const { requests } = application;

    const { zoomAuthorize, zoomSignature } = requests;

    const initialContext = getContextInitialData(user);

    const signatureData = 'test signature';
    requests.zoomSignature = mockDataResponse({
      data: signatureData,
      error: null,
    });

    const authData = 'test auth';
    requests.zoomAuthorize = mockDataResponse({
      data: authData,
      error: null,
    });

    renderWithProvider(
      <>
        <ZoomContext.Consumer>
          {(value: ZoomContextType) =>
            Object.keys(value).map(key => (
              <span key={key}>
                {`${key.toString()}: ${value[
                  key as keyof ZoomContextType
                ]?.toString()}`}
              </span>
            ))
          }
        </ZoomContext.Consumer>
      </>,
      { ...initialContext, user },
    );
    expect(await getElementByRegex(/^userSignature:/)).toBe(
      `userSignature: ${signatureData}`,
    );
    expect(await getElementByRegex(/^hostUserZakToken:/)).toBe(
      `hostUserZakToken: ${authData}`,
    );

    requests.zoomAuthorize = zoomAuthorize;
    requests.zoomSignature = zoomSignature;
  });

  it('ZoomContext should update signature correctly after API requests when user is student', async () => {
    const { student: user } = fixtures.users;
    const { requests } = application;

    const { zoomAuthorize, zoomSignature } = requests;

    const initialContext = getContextInitialData(user);

    const signatureData = 'test signature';
    requests.zoomSignature = mockDataResponse({
      data: signatureData,
      error: null,
    });

    const authData = 'test auth';
    requests.zoomAuthorize = mockDataResponse({
      data: authData,
      error: null,
    });

    renderWithProvider(
      <>
        <ZoomContext.Consumer>
          {(value: ZoomContextType) =>
            Object.keys(value).map(key => (
              <span key={key}>
                {`${key.toString()}: ${value[
                  key as keyof ZoomContextType
                ]?.toString()}`}
              </span>
            ))
          }
        </ZoomContext.Consumer>
      </>,
      { ...initialContext, user },
    );
    expect(await getElementByRegex(/^userSignature:/)).toBe(
      `userSignature: ${signatureData}`,
    );
    expect(await getElementByRegex(/^hostUserZakToken:/)).toBe(
      `hostUserZakToken: undefined`,
    );

    requests.zoomAuthorize = zoomAuthorize;
    requests.zoomSignature = zoomSignature;
  });
});
