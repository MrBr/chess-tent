import React from 'react';
import '@testing-library/jest-dom';
import { screen, act } from '@testing-library/react';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import application from '@application';

import {
  renderWithProvider,
  getContextInitialData,
  mockDataResponse,
  getElementByRegex,
} from './utils';
import {
  ZoomConnectionStatus,
  ZoomContext,
  ZoomContextType,
} from '../../../modules/zoom/context';

beforeAll(async () => await application.init());

const { fixtures, requests, components } = application;

describe('Zoom Activity View', () => {
  it('Zoom Activity View container should have children when meeting started', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomGuestControl } = components;
    const initialContext = getContextInitialData(user);

    const signatureData = 'test signature66';
    requests.zoomSignature = mockDataResponse({
      data: signatureData,
      error: null,
    });

    const authData = 'test auth';
    requests.zoomAuthorize = mockDataResponse({
      data: '',
      error: null,
    });

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

    renderWithProvider(
      <>
        <ZoomContext.Consumer>
          {(value: ZoomContextType) =>
            Object.keys(value).map(key => (
              <span key={key}>
                {`${key.toString()}: ${value[
                  key as keyof ZoomContextType
                ]?.toString()}`}
                {console.log(value['connectionStatus'])}
              </span>
            ))
          }
        </ZoomContext.Consumer>
        <ZoomGuestControl />
        <ZoomActivityView />
      </>,
      { ...initialContext, user },
    );

    expect(await getElementByRegex(/^connectionStatus:/)).toBe(
      `connectionStatus: ${ZoomConnectionStatus.NOT_CONNECTED}`,
    );

    const inputElement = await screen.findByPlaceholderText(
      'Meeting password (if any)',
    );
    const buttonElement = await screen.findByText('Join');

    await act(async () => await userEvent.type(inputElement, 'test-password'));
    await act(async () => await userEvent.click(buttonElement));

    await Promise.resolve(async () =>
      expect(await getElementByRegex(/^connectionStatus:/)).toBe(
        `connectionStatus: ${ZoomConnectionStatus.CONNECTING}`,
      ),
    );

    expect(await getElementByRegex(/^connectionStatus:/)).toBe(
      `connectionStatus: ${ZoomConnectionStatus.CONNECTED}`,
    );
  });
});
