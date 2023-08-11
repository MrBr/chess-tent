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
  it('Zoom Activity View should set ZoomContext to status CONNECTING when student joining', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomGuestControl } = components;

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomGuestControl />
        <ZoomActivityView />
      </>,
    );

    jest.spyOn(ZoomMtgEmbedded, 'createClient').mockReturnValue({
      ...ZoomMtgEmbedded.createClient(),
      init: jest.fn().mockResolvedValue(() => {}),
      join: jest.fn().mockResolvedValue(() => {}),
      on: jest.fn(),
    });

    const inputElement = await screen.findByPlaceholderText(
      'Meeting password (if any)',
    );
    const buttonElement = await screen.findByText('Join');

    await userEvent.type(inputElement, 'test-password');
    await userEvent.click(buttonElement);

    expect(await getElementByRegex(/^connectionStatus:/)).toBe(
      `connectionStatus: ${ZoomConnectionStatus.CONNECTING}`,
    );
  });

  it('Zoom Activity View should set ZoomContext to status CONNECTING when coach joining', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomHostControl } = components;

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomHostControl />
        <ZoomActivityView />
      </>,
    );

    jest.spyOn(ZoomMtgEmbedded, 'createClient').mockReturnValue({
      ...ZoomMtgEmbedded.createClient(),
      init: jest.fn().mockResolvedValue(() => {}),
      join: jest.fn().mockResolvedValue(() => {}),
      on: jest.fn(),
    });

    const passwordInputElement = await screen.findByPlaceholderText(
      'Meeting password (if any)',
    );
    const meetingNumberInputElement = await screen.findByPlaceholderText(
      'Meeting number',
    );
    const buttonElement = await screen.findByText('Join');

    await userEvent.type(passwordInputElement, 'test-password');
    await userEvent.type(meetingNumberInputElement, 'test-meetingNumber');
    await userEvent.click(buttonElement);

    expect(await getElementByRegex(/^connectionStatus:/)).toBe(
      `connectionStatus: ${ZoomConnectionStatus.CONNECTING}`,
    );
  });

  it('Zoom Activity View should set ZoomContext to status CONNECTED when connection-status is set to Connected', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomGuestControl } = components;

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomGuestControl />
        <ZoomActivityView />
      </>,
    );

    jest.spyOn(ZoomMtgEmbedded, 'createClient').mockReturnValue({
      ...ZoomMtgEmbedded.createClient(),
      init: jest.fn().mockResolvedValue(() => {}),
      join: jest.fn().mockResolvedValue(() => {}),
      on: jest.fn().mockImplementation((event, callback) =>
        setTimeout(() => {
          if (event === 'connection-change') {
            return callback({ state: 'Connected' });
          }
        }, 0),
      ),
    });

    const inputElement = await screen.findByPlaceholderText(
      'Meeting password (if any)',
    );
    const buttonElement = await screen.findByText('Join');

    await userEvent.type(inputElement, 'test-password');
    await userEvent.click(buttonElement);

    expect(await getElementByRegex(/^connectionStatus:/)).toBe(
      `connectionStatus: ${ZoomConnectionStatus.CONNECTED}`,
    );
  });

  it('Zoom Activity View should reset ZoomContext when zoom connection changes to Closed', async () => {
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

    jest.spyOn(ZoomMtgEmbedded, 'createClient').mockReturnValue({
      ...ZoomMtgEmbedded.createClient(),
      init: jest.fn().mockResolvedValue(() => {}),
      join: jest.fn().mockResolvedValue(() => {}),
      on: jest.fn().mockImplementation((event, callback) => {
        setTimeout(() => {
          if (event === 'connection-change') {
            return callback({
              state: 'Closed',
            });
          }
        }, 0);
      }),
    });

    const inputElement = await screen.findByPlaceholderText(
      'Meeting password (if any)',
    );
    const buttonElement = await screen.findByText('Join');

    await userEvent.type(inputElement, 'test-password');
    await userEvent.click(buttonElement);

    expect(await getElementByRegex(/connectionStatus/)).toBe(
      'connectionStatus: ' + ZoomConnectionStatus.NOT_CONNECTED,
    );
  });

  it('Zoom Activity View should reset ZoomContext when zoom connection fails with error code different than meeting not started (3008)', async () => {
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

    jest.spyOn(ZoomMtgEmbedded, 'createClient').mockReturnValue({
      ...ZoomMtgEmbedded.createClient(),
      init: jest.fn().mockResolvedValue(() => {}),
      join: jest.fn().mockResolvedValue(() => {}),
      on: jest.fn().mockImplementation((event, callback) => {
        setTimeout(() => {
          if (event === 'connection-change') {
            return callback({
              state: 'Fail',
            });
          }
        }, 100);
      }),
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
