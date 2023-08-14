import React, { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import application from '@application';
import ZoomMtgEmbedded from '@zoomus/websdk/embedded';
import { RenderResult, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { User } from '@chess-tent/models';
import { ZoomResponse } from '@chess-tent/types';

import {
  createInitialContext,
  InitialContextData,
  ZoomContext,
  ZoomContextType,
} from '../../../modules/zoom/context';

const { components } = application;

const redirectUri = 'https://localhost:3000/test';

export const renderWithProvider = (
  children: ReactNode,
  options: any,
): RenderResult => {
  const { ZoomProvider } = components;

  return render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/',
          search: options?.authCode ? `?code=${options.authCode}` : undefined,
        },
      ]}
    >
      <ZoomProvider
        redirectUri={options?.redirectUri || redirectUri}
        user={options.user}
        meetingNumber={options.meetingNumber}
      >
        {children}
      </ZoomProvider>
    </MemoryRouter>,
  );
};

export const renderWithProviderAndCustomConsumer = (
  user: User,
  children?: ReactNode,
) => {
  const initialContext = getContextInitialData(user);

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
      {children}
    </>,
    { ...initialContext, user },
  );

  return initialContext;
};

export const mockZoomCreateClient = (on = jest.fn()) =>
  jest.spyOn(ZoomMtgEmbedded, 'createClient').mockReturnValue({
    ...ZoomMtgEmbedded.createClient(),
    init: jest.fn().mockResolvedValue(() => {}),
    join: jest.fn().mockResolvedValue(() => {}),
    on,
  });

export const mockDataResponse = (data: {
  data: string;
  error: string | null;
}) => jest.fn(() => Promise.resolve<ZoomResponse>(data));

export const mockEmptyDataResponse = () => jest.fn().mockResolvedValue({});

export const mockStudentInput = async () => {
  const inputElement = await screen.findByPlaceholderText(
    'Meeting password (if any)',
  );
  const buttonElement = await screen.findByText('Join');

  await userEvent.type(inputElement, 'test-password');
  await userEvent.click(buttonElement);
};

export const mockCoachInput = async () => {
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
};

export const getContextInitialData = (user: User) => {
  const initialData = {
    meetingNumber: '4785447829',
    user,
    code: 'code',
    redirectUri: 'https://localhost:3000/',
    zoomSDKElementRef: jest.fn() as any,
  } as InitialContextData;
  const initialContext = createInitialContext({ ...initialData });

  return initialContext;
};

export const createDomElement = (text: string) => {
  const div = document.createElement('div');
  const content = document.createTextNode(text);
  div.appendChild(content);

  document.body.appendChild(div);
};

export const findPasswordInput = async (): Promise<HTMLElement> =>
  screen.findByPlaceholderText('Meeting password (if any)');

export const findMeetingNumberInput = (): Promise<HTMLElement> =>
  screen.findByPlaceholderText('Meeting number');

export const findElementByRegex = (matcher: RegExp) =>
  screen.findByText(matcher).then(result => result.textContent);
