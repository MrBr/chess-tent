import React from 'react';
import '@testing-library/jest-dom';
import { screen } from '@testing-library/react';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import application from '@application';

import {
  renderWithProviderAndCustomConsumer,
  getElementByRegex,
  mockDataResponse,
} from './utils';
import { ZoomConnectionStatus } from '../../../modules/zoom/context';

beforeAll(async () => await application.init());

const { fixtures, requests, components } = application;

describe('Zoom Activity View', () => {
  it('Zoom Activity View should set ZoomContext to status CONNECTING when joining', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomGuestControl } = components;

    requests.zoomSignature = mockDataResponse({
      data: 'test signature',
      error: null,
    });

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

  it('Zoom Activity View should set ZoomContext to status CONNECTED when connection-status is set to Connected', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomGuestControl } = components;

    requests.zoomSignature = mockDataResponse({
      data: 'test signature',
      error: null,
    });

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
});
