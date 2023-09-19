import React, { useEffect } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import type { PayPalButtonsComponentProps } from '@paypal/react-paypal-js/dist/types/types/paypalButtonTypes';

interface SubscribeProps {
  plan_id: string;
  quantity: number;
  onSubscribe: (orderId: string) => void;
  onFailure: (e: unknown) => void;
}

const subscriptionButtonStyle: PayPalButtonsComponentProps['style'] = {
  label: 'subscribe',
};

const Subscribe = ({
  quantity,
  plan_id,
  onSubscribe,
  onFailure,
}: SubscribeProps) => {
  const [{ options }, dispatch] = usePayPalScriptReducer();

  useEffect(() => {
    dispatch({
      type: 'resetOptions',
      value: {
        ...options,
        intent: 'subscription',
      },
    });
    // should do only on init
    // eslint-disable-next-line
  }, []);

  const createSubscription: PayPalButtonsComponentProps['createSubscription'] =
    async (data, actions) => {
      try {
        const orderId = await actions.subscription.create({
          plan_id,
          quantity: quantity as unknown as string,
        });

        onSubscribe(orderId);
        return orderId;
      } catch (e) {
        onFailure(e);
        throw e;
      }
    };

  return (
    <PayPalButtons
      createSubscription={createSubscription}
      style={subscriptionButtonStyle}
    />
  );
};

export default Subscribe;
