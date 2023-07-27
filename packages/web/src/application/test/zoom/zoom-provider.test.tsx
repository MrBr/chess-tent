import React, { ReactNode } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { User } from '@chess-tent/models';
import application from '@application';
import { users, zoom } from '../fixtures';

const { components } = application;

const renderInsideProvider = (
  children: ReactNode,
  user: User,
  meetingNumber?: string,
) => {
  const { Router, ZoomProvider } = components;

  render(
    <Router>
      {() => (
        <>
          <ZoomProvider
            redirectUri={zoom.redirectUri}
            user={user}
            meetingNumber={meetingNumber}
          >
            {' '}
          </ZoomProvider>
          {children}
        </>
      )}
    </Router>,
  );
};

describe('Zoom Provider', () => {
  const coach: User = users.find(user => user.coach)!;
  const student: User = users.find(user => !user.coach)!;

  test('Student should have only password input', async () => {
    const { ZoomGuestControl } = components;

    renderInsideProvider(<ZoomGuestControl />, student, zoom.meetingNumber);

    const passwordInput = screen.queryByPlaceholderText(
      'Meeting password (if any)',
    );
    const meetingNumberInput = screen.queryByPlaceholderText('Meeting number');

    await waitFor(() => expect(expect(passwordInput).toBeTruthy()));
    await waitFor(() => expect(expect(meetingNumberInput).toBeFalsy()));
  });
});
