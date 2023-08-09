import React from 'react';
import '@testing-library/jest-dom';
import fetch from 'node-fetch';
import application from '@application';
import { screen } from '@testing-library/react';
import {
  renderWithProvider,
  getPasswordInput,
  getMeetingNumberInput,
  mockEmptyDataResponse,
} from './utils';

Object.defineProperty(global.self, 'fetch', { value: fetch });

beforeAll(() => application.init());

const { components, fixtures, requests } = application;

const meetingNumber = '4785447829';

describe('Zoom Controls', () => {
  requests.zoomSignature = mockEmptyDataResponse();
  requests.zoomAuthorize = mockEmptyDataResponse();

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

    renderWithProvider(<ZoomHostControl />, { user: coach, authCode: 'code' });

    expect(await getPasswordInput()).toBeInTheDocument();
    expect(await getMeetingNumberInput()).toBeInTheDocument();
  });
});
