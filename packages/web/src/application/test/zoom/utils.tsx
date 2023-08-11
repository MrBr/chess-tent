import React, { ReactNode, RefObject } from 'react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import application from '@application';
import { RenderResult, render, screen } from '@testing-library/react';
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

export const getPasswordInput = async (): Promise<HTMLElement> =>
  screen.findByPlaceholderText('Meeting password (if any)');

export const getMeetingNumberInput = (): Promise<HTMLElement> =>
  screen.findByPlaceholderText('Meeting number');

export const getElementByRegex = (matcher: RegExp) =>
  screen.findByText(matcher).then(result => result.textContent);

export const mockDataResponse = (data: {
  data: string;
  error: string | null;
}) => jest.fn(() => Promise.resolve<ZoomResponse>(data));

export const mockEmptyDataResponse = () => jest.fn().mockResolvedValue({});
