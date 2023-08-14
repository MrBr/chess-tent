import React from 'react';
import '@testing-library/jest-dom';
import { waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import application from '@application';

import {
  renderWithProviderAndCustomConsumer,
  findElementByRegex,
  mockDataResponse,
  getContextInitialData,
  mockZoomCreateClient,
  mockStudentInput,
  mockCoachInput,
  createDomElement,
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

    expect(await findElementByRegex(/^connectionStatus:/)).toBe(
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

    expect(await findElementByRegex(/^connectionStatus:/)).toBe(
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

    expect(await findElementByRegex(/^connectionStatus:/)).toBe(
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

    expect(await findElementByRegex(/connectionStatus/)).toBe(
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

    expect(await findElementByRegex(/connectionStatus/)).toBe(
      'connectionStatus: ' + ZoomConnectionStatus.CONNECTING,
    );

    await waitFor(async () =>
      expect(await findElementByRegex(/connectionStatus/)).toBe(
        'connectionStatus: ' + ZoomConnectionStatus.NOT_CONNECTED,
      ),
    );
  });

  it('Should spawn meet container with meeting not started yet message when MEETING_NOT_STARTED_ERROR_CODE error code is returned', async () => {
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

    const errorMessage = 'Meeting not started yet.';

    mockZoomCreateClient(
      jest.fn().mockImplementation((event, callback) => {
        setTimeout(() => {
          if (event === 'connection-change') {
            createDomElement(errorMessage);

            return callback({
              state: 'Fail',
              errorCode: MEETING_NOT_STARTED_ERROR_CODE,
            });
          }
        }, 100);
      }),
    );
    await mockStudentInput();

    expect(await findElementByRegex(/connectionStatus/)).toBe(
      'connectionStatus: ' + ZoomConnectionStatus.CONNECTING,
    );

    expect(
      await screen.findByText(new RegExp(errorMessage)),
    ).toBeInTheDocument();
  });

  it('Should spawn error alert with wrong password message and closed connection when wrong password error is returned', async () => {
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

    const errorMessage = 'Passcode Wrong.';

    jest.spyOn(window, 'alert').mockImplementation(() => {});

    mockZoomCreateClient(
      jest.fn().mockImplementation((event, callback) => {
        setTimeout(() => {
          if (event === 'connection-change') {
            alert(errorMessage);

            return callback({
              state: 'Fail',
            });
          }
        }, 100);
      }),
    );
    await mockStudentInput();

    expect(await findElementByRegex(/connectionStatus/)).toBe(
      'connectionStatus: ' + ZoomConnectionStatus.CONNECTING,
    );

    await waitFor(async () =>
      expect(await findElementByRegex(/connectionStatus/)).toBe(
        'connectionStatus: ' + ZoomConnectionStatus.NOT_CONNECTED,
      ),
    );

    expect(window.alert).toBeCalledWith(errorMessage);
  });

  it('Should spawn error alert with meeting number not found message and closed connection with meeting not found error', async () => {
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

    const errorMessage = 'The Meeting Number is not found.';

    jest.spyOn(window, 'alert').mockImplementation(() => {});

    mockZoomCreateClient(
      jest.fn().mockImplementation((event, callback) => {
        setTimeout(() => {
          if (event === 'connection-change') {
            alert(errorMessage);

            return callback({
              state: 'Fail',
            });
          }
        }, 100);
      }),
    );
    await mockStudentInput();

    expect(await findElementByRegex(/connectionStatus/)).toBe(
      'connectionStatus: ' + ZoomConnectionStatus.CONNECTING,
    );

    await waitFor(async () =>
      expect(await findElementByRegex(/connectionStatus/)).toBe(
        'connectionStatus: ' + ZoomConnectionStatus.NOT_CONNECTED,
      ),
    );

    expect(window.alert).toBeCalledWith(errorMessage);
  });
});
