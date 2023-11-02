import { render } from '@testing-library/react-native';
import { getEnrolledLevelAsync } from 'expo-local-authentication';
import type { PropsWithChildren } from 'react';
import React from 'react';

import { App } from './App';

jest.mock('expo-local-authentication', () => {
  return {
    ...jest.requireActual('expo-local-authentication'),
    authenticateAsync: jest.fn().mockResolvedValue({ success: true }),
    getEnrolledLevelAsync: jest.fn().mockResolvedValue(0),
  };
});
jest.mock('react-native-safe-area-context', () => {
  return {
    SafeAreaProvider: ({ children }: PropsWithChildren) => children,
    SafeAreaView: ({ children }: PropsWithChildren) => children,
  };
});

describe('App', () => {
  it('should render notification', async () => {
    (getEnrolledLevelAsync as unknown as jest.SpyInstance).mockResolvedValue(0);
    const { findByText } = render(<App />);

    expect(await findByText('Authentication Required!')).toBeOnTheScreen();
  });

  it('should render todo list', async () => {
    (getEnrolledLevelAsync as unknown as jest.SpyInstance).mockResolvedValue(1);
    const { findByText } = render(<App />);

    expect(await findByText('Todo')).toBeOnTheScreen();
  });
});
