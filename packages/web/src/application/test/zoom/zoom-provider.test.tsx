import React, { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import application from '@application';
import { render, screen } from '@testing-library/react';
import { User } from '@chess-tent/models';
import { getPasswordInput, getMeetingNumberInput } from './utils';

const { components, fixtures } = application;

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
    const { student } = fixtures.users;

    renderWithProvider(<ZoomGuestControl />, {
      user: student,
      meetingNumber: meetingNumber,
    });

    expect(await getPasswordInput()).toBeInTheDocument();
  });

  it('Coach should have authorize button only when no authCode', async () => {
    const { ZoomHostControl } = components;
    const { coach } = fixtures.users;

    renderWithProvider(<ZoomHostControl />, { user: coach });

    expect(await screen.findByText('Authorize Zoom')).toBeInTheDocument();
  });

  it('Coach should have password and meeting number input when authenticated', async () => {
    const { ZoomHostControl } = components;
    const { coach } = fixtures.users;

    renderWithProvider(<ZoomHostControl />, { user: coach, queryCode: true });

    expect(await getPasswordInput()).toBeInTheDocument();
    expect(await getMeetingNumberInput()).toBeInTheDocument();
  });
});
