import React, { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { User } from '@chess-tent/models';
import application from '@application';
import { users } from '../fixtures';
import { getPasswordInput, getMeetingNumberInput } from './utils';

const { components } = application;
const { coach, student } = users;

interface RenderOptions {
  user: User;
  meetingNumber?: string;
  queryCode?: boolean;
}

const meetingNumber = '4785447829';
const redirectUri = 'https://localhost:3000/test';

const renderWithProvider = (children: ReactNode, options: RenderOptions) => {
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

describe('Zoom Provider', () => {
  it('Student should have only password input', async () => {
    const { ZoomGuestControl } = components;

    renderWithProvider(<ZoomGuestControl />, {
      user: student,
      meetingNumber: meetingNumber,
    });

    expect(await getPasswordInput()).toBeInTheDocument();
  });

  it('Coach should have authorize button only when no authCode', async () => {
    const { ZoomHostControl } = components;

    renderWithProvider(<ZoomHostControl />, { user: coach });

    expect(await screen.findByText('Authorize Zoom')).toBeInTheDocument();
  });

  it('Coach should have password and meeting number input when authenticated', async () => {
    const { ZoomHostControl } = components;

    renderWithProvider(<ZoomHostControl />, { user: coach, queryCode: true });

    expect(await getPasswordInput()).toBeInTheDocument();
    expect(await getMeetingNumberInput()).toBeInTheDocument();
  });
});
