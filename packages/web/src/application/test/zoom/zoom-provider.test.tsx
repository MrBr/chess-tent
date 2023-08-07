import React from 'react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';

import application from '@application';

import { renderWithProvider, getEmptyRequest } from './utils';
import { ZoomContext, ZoomContextType } from '../../../modules/zoom/context';

import {
  getElementByRegex,
  getContextInitialData,
  getCustomRequest,
} from './utils';

beforeAll(() => application.init());

const { fixtures, requests } = application;

describe('Zoom Provider', () => {
  it('ZoomContext should have correct initial values', async () => {
    const { student: user } = fixtures.users;

    requests.zoomSignature = getEmptyRequest();
    requests.zoomAuthorize = getEmptyRequest();

    const { initialContext, customRenderData } = getContextInitialData(user);

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
      customRenderData,
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

  it('ZoomContext should update correctly after API requests', async () => {
    const { coach } = fixtures.users;
    const { zoomAuthorize, zoomSignature } = requests;
    const { customRenderData } = getContextInitialData(coach);

    const signatureData = 'test signature';
    requests.zoomSignature = getCustomRequest({
      data: signatureData,
      error: null,
    });

    const authData = 'test auth';
    requests.zoomAuthorize = getCustomRequest({
      data: authData,
      error: null,
    });

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
      customRenderData,
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
});
