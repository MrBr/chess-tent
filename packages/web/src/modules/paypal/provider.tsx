import React from 'react';
import { PropsWithChildren } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const PayPalProvider = ({ children }: PropsWithChildren<{}>) => (
  <PayPalScriptProvider
    options={{
      clientId: process.env.REACT_APP_PAY_PAL_CLIENT_ID as string,
      components: 'buttons',
      intent: 'subscription',
      vault: true,
    }}
  >
    {children}
  </PayPalScriptProvider>
);

export default PayPalProvider;
