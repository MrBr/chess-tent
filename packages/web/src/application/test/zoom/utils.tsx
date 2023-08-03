import React, { ReactNode, RefObject } from 'react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import application from '@application';
import { RenderResult, render, screen } from '@testing-library/react';
import { User } from '@chess-tent/models';

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

export const getPasswordInput = async (): Promise<HTMLElement> =>
  screen.findByPlaceholderText('Meeting password (if any)');

export const getMeetingNumberInput = (): Promise<HTMLElement> =>
  screen.findByPlaceholderText('Meeting number');

export const getElementByRegex = (matcher: RegExp) =>
  screen.findByText(matcher).then(result => result.textContent);
