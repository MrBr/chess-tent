import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { mockCreateSubscription } from '../mocks/pay-pal-buttons';
import PayPalProvider from '../provider';

import Subscribe from '../components/subscribe';

describe('PayPal Subscribe', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('should call onSubscribe', async function () {
    const createMock = mockCreateSubscription();
    const onSubscribe = jest.fn();

    render(
      <PayPalProvider>
        <Subscribe
          onSubscribe={onSubscribe}
          quantity={2}
          onFailure={() => {}}
          plan_id="plan"
        />
      </PayPalProvider>,
    );

    await userEvent.click(screen.getByText('Subscribe'));

    expect(createMock).toHaveBeenCalledWith({
      plan_id: 'plan',
      quantity: 2,
    });
    expect(onSubscribe).toHaveBeenCalledWith('orderId');
  });
  it('should call onFailure', async function () {
    mockCreateSubscription(false);
    const onFailure = jest.fn();

    render(
      <PayPalProvider>
        <Subscribe
          onSubscribe={() => {}}
          quantity={2}
          onFailure={onFailure}
          plan_id="plan"
        />
      </PayPalProvider>,
    );

    await userEvent.click(screen.getByText('Subscribe'));

    expect(onFailure).toHaveBeenCalledWith(expect.any(Error));
  });
});
