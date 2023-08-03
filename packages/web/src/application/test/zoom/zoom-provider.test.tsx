import React from 'react';
import '@testing-library/jest-dom';

import application from '@application';
import { renderWithProvider, RenderOptions } from './utils';
import {
  ZoomContext,
  createInitialContext,
  ZoomContextType,
  InitialContextData,
} from '../../../modules/zoom/context';

import { getElementByRegex } from './utils';

const { fixtures } = application;

describe('Zoom Provider', () => {
  it('ZoomContext should have corrent initial values', async () => {
    const { student } = fixtures.users;

    const useRefMock = jest.spyOn(React, 'useRef').mockReturnValue({
      current: null,
    });

    const initialData = {
      meetingNumber: '4785447829',
      user: student,
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

    renderWithProvider(
      <ZoomContext.Consumer>
        {(value: ZoomContextType) =>
          Object.keys(value).map(key => (
            <span key={key}>
              {key.toString()}:{' '}
              {value[key as keyof ZoomContextType]?.toString()}
            </span>
          ))
        }
      </ZoomContext.Consumer>,
      customRenderData,
    );

    Object.keys(initialContext).forEach(async key => {
      if (!initialContext[key as keyof ZoomContextType]) {
        return;
      }

      const matcher = new RegExp(`^${key}:`);
      expect(await getElementByRegex(matcher)).toBe(
        `${key}: ${initialContext[key as keyof ZoomContextType]?.toString()}`,
      );
    });
  });
});
