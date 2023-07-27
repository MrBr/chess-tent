import React, { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { User } from '@chess-tent/models';
import application from '@application';
import { users, zoom } from '../fixtures';

const { components } = application;

interface RenderOptions {
  children: ReactNode;
  user: User;
  meetingNumber?: string;
  queryCode?: boolean;
}

const renderInsideProvider = ({
  children,
  user,
  meetingNumber,
  queryCode,
}: RenderOptions) => {
  const { ZoomProvider } = components;

  render(
    <MemoryRouter
      initialEntries={[
        { pathname: '/', search: queryCode ? '?code=testcode' : undefined },
      ]}
    >
      <ZoomProvider
        redirectUri={zoom.redirectUri}
        user={user}
        meetingNumber={meetingNumber}
      >
        {children}
      </ZoomProvider>
    </MemoryRouter>,
  );
};

describe('Zoom Provider', () => {
  const coach: User = users.find(user => user.coach)!;
  const student: User = users.find(user => !user.coach)!;

  test('Student should have only password input', async () => {
    const { ZoomGuestControl } = components;

    renderInsideProvider({
      children: <ZoomGuestControl />,
      user: student,
      meetingNumber: zoom.meetingNumber,
    });

    const passwordInput = screen.queryByPlaceholderText(
      'Meeting password (if any)',
    );
    const meetingNumberInput = screen.queryByPlaceholderText('Meeting number');

    await waitFor(() => expect(passwordInput).toBeTruthy());
    await waitFor(() => expect(meetingNumberInput).toBeFalsy());
  });

  test('Coach should have authorize button only when no authCode', async () => {
    const { ZoomHostControl } = components;

    renderInsideProvider({
      children: <ZoomHostControl />,
      user: coach,
    });

    const authButton = screen.getByRole('button', {
      name: 'Authorize Zoom',
    });

    await waitFor(() => expect(authButton).toBeTruthy());
  });

  test('Coach should have password and meeting number input when authenticated', async () => {
    const { ZoomHostControl } = components;

    renderInsideProvider({
      children: <ZoomHostControl />,
      user: coach,
      queryCode: true,
    });

    const passwordInput = screen.queryByPlaceholderText(
      'Meeting password (if any)',
    );
    const meetingNumberInput = screen.queryByPlaceholderText('Meeting number');

    await waitFor(() => expect(passwordInput).toBeTruthy());
    await waitFor(() => expect(meetingNumberInput).toBeTruthy());
  });
});
