import { screen } from '@testing-library/react';

export const getPasswordInput = (): HTMLElement | null =>
  screen.queryByPlaceholderText('Meeting password (if any)');

export const getMeetingNumberInput = (): HTMLElement | null =>
  screen.queryByPlaceholderText('Meeting number');
