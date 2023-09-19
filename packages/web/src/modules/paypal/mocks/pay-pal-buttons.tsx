import React, { ComponentProps } from 'react';
import type { PayPalButtonsComponentProps } from '@paypal/react-paypal-js/dist/types/types/paypalButtonTypes';

import * as payPalSdk from '@paypal/react-paypal-js';

type PayPalButtonsProps = ComponentProps<typeof payPalSdk.PayPalButtons>;
export const mockCreateSubscription = (success = true) => {
  const createMock = jest.fn().mockImplementation(async () => {
    if (success) {
      return 'orderId';
    }
    throw new Error('Subscription failed');
  });
  const actions: Parameters<
    Required<PayPalButtonsComponentProps>['createSubscription']
  >[1] = {
    subscription: {
      create: createMock,
      revise: jest.fn(),
    },
  };
  jest
    .spyOn(payPalSdk, 'PayPalButtons')
    .mockImplementation(({ createSubscription }: PayPalButtonsProps) => (
      <div onClick={() => createSubscription?.({}, actions)}>Subscribe</div>
    ));
  return createMock;
};
