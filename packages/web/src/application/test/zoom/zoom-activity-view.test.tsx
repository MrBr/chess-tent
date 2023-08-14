import React from 'react';
import '@testing-library/jest-dom';
import { screen, waitFor } from '@testing-library/react';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import application from '@application';

import {
  renderWithProviderAndCustomConsumer,
  getElementByRegex,
  mockDataResponse,
  getContextInitialData,
  mockZoomCreateClient,
} from './utils';
import { ZoomConnectionStatus } from '../../../modules/zoom/context';

const MEETING_NOT_STARTED_ERROR_CODE = 3008;

beforeAll(async () => {
  await application.init();

  requests.zoomSignature = mockDataResponse({
    data: 'test signature',
    error: null,
  });
  requests.zoomAuthorize = mockDataResponse({
    data: 'test auth',
    error: null,
  });
});

afterEach(() => jest.clearAllMocks());

const { fixtures, requests, components } = application;

describe('Zoom Activity View', () => {
  it('Should set ZoomContext to status CONNECTING when student joining', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomGuestControl } = components;

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomGuestControl />
        <ZoomActivityView />
      </>,
    );

    mockZoomCreateClient();
    await mockStudentInput();

    expect(await getElementByRegex(/^connectionStatus:/)).toBe(
      `connectionStatus: ${ZoomConnectionStatus.CONNECTING}`,
    );
  });

  it('Should set ZoomContext to status CONNECTING when coach joining', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomHostControl } = components;

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomHostControl />
        <ZoomActivityView />
      </>,
    );

    mockZoomCreateClient();
    await mockCoachInput();

    expect(await getElementByRegex(/^connectionStatus:/)).toBe(
      `connectionStatus: ${ZoomConnectionStatus.CONNECTING}`,
    );
  });

  it('Should set ZoomContext to status CONNECTED when connection-status is set to Connected', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomGuestControl } = components;

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomGuestControl />
        <ZoomActivityView />
      </>,
    );

    mockZoomCreateClient(
      jest.fn().mockImplementation((event, callback) =>
        setTimeout(() => {
          if (event === 'connection-change') {
            return callback({ state: 'Connected' });
          }
        }, 0),
      ),
    );

    await mockStudentInput();

    expect(await getElementByRegex(/^connectionStatus:/)).toBe(
      `connectionStatus: ${ZoomConnectionStatus.CONNECTED}`,
    );
  });

  it('Should reset ZoomContext when zoom connection changes to Closed', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomGuestControl } = components;
    const initialContext = getContextInitialData(user);
    initialContext.connectionStatus = ZoomConnectionStatus.CONNECTED;

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomGuestControl />
        <ZoomActivityView />
      </>,
    );

    mockZoomCreateClient(
      jest.fn().mockImplementation((event, callback) => {
        setTimeout(() => {
          if (event === 'connection-change') {
            return callback({
              state: 'Closed',
            });
          }
        }, 0);
      }),
    );

    await mockStudentInput();

    expect(await getElementByRegex(/connectionStatus/)).toBe(
      'connectionStatus: ' + ZoomConnectionStatus.NOT_CONNECTED,
    );
  });

  it('Should reset ZoomContext when zoom connection fails with error code different than meeting not started (3008)', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomGuestControl } = components;
    const initialContext = getContextInitialData(user);
    initialContext.connectionStatus = ZoomConnectionStatus.CONNECTED;

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomGuestControl />
        <ZoomActivityView />
      </>,
    );

    mockZoomCreateClient(
      jest.fn().mockImplementation((event, callback) => {
        setTimeout(() => {
          if (event === 'connection-change') {
            return callback({
              state: 'Fail',
            });
          }
        }, 100);
      }),
    );

    await mockStudentInput();

    expect(await getElementByRegex(/connectionStatus/)).toBe(
      'connectionStatus: ' + ZoomConnectionStatus.CONNECTING,
    );

    await waitFor(async () =>
      expect(await getElementByRegex(/connectionStatus/)).toBe(
        'connectionStatus: ' + ZoomConnectionStatus.NOT_CONNECTED,
      ),
    );
  });

    const inputElement = await screen.findByPlaceholderText(
      'Meeting password (if any)',
    );
    const buttonElement = await screen.findByText('Join');

    await userEvent.type(inputElement, 'test-password');
    await userEvent.click(buttonElement);

    expect(await getElementByRegex(/connectionStatus/)).toBe(
      'connectionStatus: ' + ZoomConnectionStatus.CONNECTING,
    );

    await waitFor(async () =>
      expect(await getElementByRegex(/connectionStatus/)).toBe(
        'connectionStatus: ' + ZoomConnectionStatus.NOT_CONNECTED,
      ),
    );
  });
});
