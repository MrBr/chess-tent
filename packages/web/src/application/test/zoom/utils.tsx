import React, { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import application from '@application';
import { render, screen } from '@testing-library/react';
import { User } from '@chess-tent/models';

const { components } = application;

interface RenderOptions {
  user: User;
  meetingNumber?: string;
  queryCode?: boolean;
}

const redirectUri = 'https://localhost:3000/test';

export const renderWithProvider = (
  children: ReactNode,
  options: RenderOptions,
) => {
  const { ZoomProvider } = components;

  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: '/',
          search: options?.queryCode ? '?code=testcode' : undefined,
        },
      ]}
    >
      <ZoomProvider
        redirectUri={redirectUri}
        user={options.user}
        meetingNumber={options?.meetingNumber}
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
