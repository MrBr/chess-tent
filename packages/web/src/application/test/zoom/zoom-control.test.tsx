import React from 'react';
import '@testing-library/jest-dom';
import fetch from 'node-fetch';
import application from '@application';
import { screen } from '@testing-library/react';
import {
  renderWithProvider,
  findPasswordInput,
  findMeetingNumberInput,
  mockEmptyDataResponse,
  renderWithProviderAndCustomConsumer,
  mockZoomCreateClient,
  mockStudentInput,
  mockDataResponse,
  mockCoachInput,
} from './utils';

Object.defineProperty(global.self, 'fetch', { value: fetch });

beforeAll(() => application.init());

const { components, fixtures, requests } = application;

const meetingNumber = '4785447829';

describe('Zoom Guest Controls', () => {
  requests.zoomSignature = mockEmptyDataResponse();
  requests.zoomAuthorize = mockEmptyDataResponse();

  it('should have only password input', async () => {
    const { ZoomGuestControl } = components;
    const { student } = fixtures.users;

    renderWithProvider(<ZoomGuestControl />, {
      user: student,
      meetingNumber: meetingNumber,
    });

    expect(await findPasswordInput()).toBeInTheDocument();
  });

  it('should not render inputs if connection is in progress', async () => {
    const { student: user } = fixtures.users;
    const { ZoomActivityView, ZoomGuestControl } = components;

    requests.zoomSignature = mockDataResponse({
      data: 'test signature',
      error: null,
    });
    requests.zoomAuthorize = mockDataResponse({
      data: 'test auth',
      error: null,
    });

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomGuestControl />
        <ZoomActivityView />
      </>,
    );

    mockZoomCreateClient();
    await mockStudentInput();

    expect(
      screen.queryByPlaceholderText('Meeting password (if any)'),
    ).not.toBeInTheDocument();
  });
});

describe('Zoom Coach Controls', () => {
  requests.zoomSignature = mockEmptyDataResponse();
  requests.zoomAuthorize = mockEmptyDataResponse();

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

    expect(await findPasswordInput()).toBeInTheDocument();
    expect(await findMeetingNumberInput()).toBeInTheDocument();
  });

  it('should not render inputs if connection is in progress', async () => {
    const { coach: user } = fixtures.users;
    const { ZoomActivityView, ZoomHostControl } = components;

    requests.zoomSignature = mockDataResponse({
      data: 'test signature',
      error: null,
    });
    requests.zoomAuthorize = mockDataResponse({
      data: 'test auth',
      error: null,
    });

    renderWithProviderAndCustomConsumer(
      user,
      <>
        <ZoomHostControl />
        <ZoomActivityView />
      </>,
    );

    mockZoomCreateClient();
    await mockCoachInput();

    expect(
      screen.queryByPlaceholderText('Meeting password (if any)'),
    ).not.toBeInTheDocument();

    expect(
      screen.queryByPlaceholderText('Meeting number'),
    ).not.toBeInTheDocument();
  });
});
