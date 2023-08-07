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
} from '../../../modules/zoom/context';

const { components } = application;

export interface RenderOptions {
  user: User;
  meetingNumber?: string;
  authCode?: string;
  redirectUri?: string;
  zoomSDKElementRef?: RefObject<HTMLElement>;
}

const redirectUri = 'https://localhost:3000/test';

export const renderWithProvider = (
  children: ReactNode,
  options: RenderOptions,
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

export const getContextInitialData = (user: User) => {
  const useRefMock = jest.spyOn(React, 'useRef').mockReturnValue({
    current: null,
  });

  const initialData = {
    meetingNumber: '4785447829',
    user,
    code: 'code',
    redirectUri: 'https://localhost:3000/',
    zoomSDKElementRef: useRefMock as any,
  } as InitialContextData;
  const initialContext = createInitialContext({ ...initialData });

  const customRenderData = {
    user: initialData.user,
    meetingNumber: initialContext.meetingNumber,
    authCode: initialContext.authCode,
    redirectUri: initialContext.redirectUri,
    zoomSDKElementRef: initialContext.zoomSDKElementRef,
  } as RenderOptions;

  return { initialContext, customRenderData };
};

export const getPasswordInput = async (): Promise<HTMLElement> =>
  screen.findByPlaceholderText('Meeting password (if any)');

export const getMeetingNumberInput = (): Promise<HTMLElement> =>
  screen.findByPlaceholderText('Meeting number');

export const getElementByRegex = (matcher: RegExp) =>
  screen.findByText(matcher).then(result => result.textContent);

export const getCustomRequest = (data: {
  data: string;
  error: string | null;
}) => jest.fn(() => Promise.resolve<ZoomResponse>(data));

export const getEmptyRequest = () => jest.fn().mockResolvedValue({});
