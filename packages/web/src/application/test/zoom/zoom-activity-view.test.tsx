import React from 'react';
import '@testing-library/jest-dom';
import { waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import application from '@application';

import { ZoomConnectionStatus } from '@chess-tent/models';

import {
  renderWithProviderAndCustomConsumer,
  mockDataResponse,
  getContextInitialData,
  mockZoomCreateClient,
  mockStudentInput,
  mockCoachInput,
  createDomElement,
  findZoomContext,
} from './utils';

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
  it('should set ZoomContext to status CONNECTING when student joining', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomGuestControl } = components;

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomGuestControl />
        <ZoomActivityView setZoomMeetingNumberState={jest.fn()} />
      </>,
    );

    mockZoomCreateClient();
    await mockStudentInput();

    const renderedContext = await findZoomContext();

    expect(renderedContext).toHaveProperty(
      'connectionStatus',
      ZoomConnectionStatus.CONNECTING,
    );
  });

  it('should set ZoomContext to status CONNECTING when coach joining', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomHostControl } = components;

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomHostControl />
        <ZoomActivityView setZoomMeetingNumberState={jest.fn()} />
      </>,
    );

    mockZoomCreateClient();
    await mockCoachInput();

    const renderedContext = await findZoomContext();

    expect(renderedContext).toHaveProperty(
      'connectionStatus',
      ZoomConnectionStatus.CONNECTING,
    );
  });

  it('should set ZoomContext to status CONNECTED when connection-status is set to Connected', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomGuestControl } = components;

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomGuestControl />
        <ZoomActivityView setZoomMeetingNumberState={jest.fn()} />
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

    const renderedContext = await findZoomContext();

    expect(renderedContext).toHaveProperty(
      'connectionStatus',
      ZoomConnectionStatus.CONNECTED,
    );
  });

  it('should reset ZoomContext when zoom connection changes to Closed', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomGuestControl } = components;
    const initialContext = getContextInitialData(user);
    initialContext.connectionStatus = ZoomConnectionStatus.CONNECTED;

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomGuestControl />
        <ZoomActivityView setZoomMeetingNumberState={jest.fn()} />
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

    const renderedContext = await findZoomContext();

    expect(renderedContext).toHaveProperty(
      'connectionStatus',
      ZoomConnectionStatus.NOT_CONNECTED,
    );
  });

  it('should reset ZoomContext when zoom connection fails with error code different than meeting not started (3008)', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomGuestControl } = components;
    const initialContext = getContextInitialData(user);
    initialContext.connectionStatus = ZoomConnectionStatus.CONNECTED;

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomGuestControl />
        <ZoomActivityView setZoomMeetingNumberState={jest.fn()} />
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

    expect(await findZoomContext()).toHaveProperty(
      'connectionStatus',
      ZoomConnectionStatus.CONNECTING,
    );

    await waitFor(async () =>
      expect(await findZoomContext()).toHaveProperty(
        'connectionStatus',
        ZoomConnectionStatus.NOT_CONNECTED,
      ),
    );
  });

  it('should spawn meet container with meeting not started yet message when MEETING_NOT_STARTED_ERROR_CODE error code is returned', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomGuestControl } = components;
    const initialContext = getContextInitialData(user);
    initialContext.connectionStatus = ZoomConnectionStatus.CONNECTED;

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomGuestControl />
        <ZoomActivityView setZoomMeetingNumberState={jest.fn()} />
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

    const renderedContext = await findZoomContext();

    expect(renderedContext).toHaveProperty(
      'connectionStatus',
      ZoomConnectionStatus.CONNECTING,
    );

    expect(
      await screen.findByText(new RegExp(errorMessage)),
    ).toBeInTheDocument();
  });

  it('should spawn error alert with wrong password message and closed connection when wrong password error is returned', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomGuestControl } = components;
    const initialContext = getContextInitialData(user);
    initialContext.connectionStatus = ZoomConnectionStatus.CONNECTED;

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomGuestControl />
        <ZoomActivityView setZoomMeetingNumberState={jest.fn()} />
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

    expect(await findZoomContext()).toHaveProperty(
      'connectionStatus',
      ZoomConnectionStatus.CONNECTING,
    );

    await waitFor(async () =>
      expect(await findZoomContext()).toHaveProperty(
        'connectionStatus',
        ZoomConnectionStatus.NOT_CONNECTED,
      ),
    );

    expect(window.alert).toBeCalledWith(errorMessage);
  });

  it('should spawn error alert with meeting number not found message and closed connection with meeting not found error', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomGuestControl } = components;
    const initialContext = getContextInitialData(user);
    initialContext.connectionStatus = ZoomConnectionStatus.CONNECTED;

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomGuestControl />
        <ZoomActivityView setZoomMeetingNumberState={jest.fn()} />
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

    expect(await findZoomContext()).toHaveProperty(
      'connectionStatus',
      ZoomConnectionStatus.CONNECTING,
    );

    await waitFor(async () =>
      expect(await findZoomContext()).toHaveProperty(
        'connectionStatus',
        ZoomConnectionStatus.NOT_CONNECTED,
      ),
    );

    expect(window.alert).toBeCalledWith(errorMessage);
  });

  it('should set external meetingNumber state', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomGuestControl } = components;
    const initialContext = getContextInitialData(user);
    initialContext.connectionStatus = ZoomConnectionStatus.CONNECTED;

    let meetingNumber;

    const setMeetingNumberMock = jest
      .fn()
      .mockImplementation((newMeetingNumber: string) => {
        meetingNumber = newMeetingNumber;
      });

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomGuestControl />
        <ZoomActivityView setZoomMeetingNumberState={setMeetingNumberMock} />
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

    const renderedContext = await findZoomContext();

    expect(renderedContext).toHaveProperty(
      'connectionStatus',
      ZoomConnectionStatus.CONNECTED,
    );

    expect(meetingNumber).toEqual(initialContext.meetingNumber);
  });
});
