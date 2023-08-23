import React from 'react';
import '@testing-library/jest-dom';

import application from '@application';
import { ZoomContext as ZoomContextType } from '@types';

import {
  renderWithProvider,
  renderWithProviderAndCustomConsumer,
  getContextInitialData,
  mockDataResponse,
  mockEmptyDataResponse,
  findZoomContext,
} from './utils';

beforeAll(() => application.init());

const { fixtures, context } = application;

describe('Zoom Provider', () => {
  it('ZoomContext should have correct initial values', async () => {
    const { student: user } = fixtures.users;
    const { requests } = application;
    const { zoomContext: ZoomContext } = context;

    const initialContext = getContextInitialData(user);

    requests.zoomSignature = mockEmptyDataResponse();
    requests.zoomAuthorize = mockEmptyDataResponse();

    renderWithProvider(
      <ZoomContext.Consumer>
        {(value: ZoomContextType) => (
          <div data-testid="zoom-context">{JSON.stringify(value)}</div>
        )}
      </ZoomContext.Consumer>,
      { ...initialContext, user },
    );

    expect(await findZoomContext()).toEqual(initialContext);
  });

  it('ZoomContext should update signature and auth data correctly after API requests when user is coach', async () => {
    const { coach: user } = fixtures.users;
    const { requests } = application;

    const { zoomAuthorize, zoomSignature } = requests;

    const signatureData = 'test signature';
    requests.zoomSignature = mockDataResponse({
      data: signatureData,
      error: null,
    });

    const authData = 'test auth';
    requests.zoomAuthorize = mockDataResponse({
      data: authData,
      error: null,
    });

    renderWithProviderAndCustomConsumer(user);

    const renderedContext = await findZoomContext();

    expect(renderedContext).toHaveProperty('userSignature', signatureData);
    expect(renderedContext).toHaveProperty('hostUserZakToken', authData);

    requests.zoomAuthorize = zoomAuthorize;
    requests.zoomSignature = zoomSignature;
  });

  it('ZoomContext should update signature correctly after API requests when user is student', async () => {
    const { student: user } = fixtures.users;
    const { requests } = application;

    const { zoomAuthorize, zoomSignature } = requests;

    const signatureData = 'test signature';
    requests.zoomSignature = mockDataResponse({
      data: signatureData,
      error: null,
    });

    const authData = 'test auth';
    requests.zoomAuthorize = mockDataResponse({
      data: authData,
      error: null,
    });

    renderWithProviderAndCustomConsumer(user);

    const renderedContext = await findZoomContext();

    expect(renderedContext).toHaveProperty('userSignature', signatureData);
    expect(renderedContext).not.toHaveProperty('hostUserZakToken');

    requests.zoomAuthorize = zoomAuthorize;
    requests.zoomSignature = zoomSignature;
  });
});
