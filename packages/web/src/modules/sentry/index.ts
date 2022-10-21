import { services } from '@application';
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  autoSessionTracking: false,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: parseInt(
    process.env.REACT_APP_SENTRY_SAMPLE_RATE as string,
  ),
});

services.logException = exception => {
  console.error(exception);
  Sentry.captureException(exception);
};
