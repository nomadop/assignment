import { render, userEvent } from '@testing-library/react-native';
import { App } from 'App';
import { authenticateAsync, getEnrolledLevelAsync } from 'expo-local-authentication';
import React from 'react';
import { RecoilRoot } from 'recoil';
import { secureLevel } from 'states/authenticate';

jest.mock('expo-local-authentication', () => {
  return {
    ...jest.requireActual('expo-local-authentication'),
    authenticateAsync: jest.fn().mockResolvedValue({ success: true }),
    getEnrolledLevelAsync: jest.fn().mockResolvedValue(0),
  };
});

describe('App', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should start authenticate when unauthenticated', async () => {
    (getEnrolledLevelAsync as unknown as jest.SpyInstance).mockResolvedValue(1);
    const { findByText, queryByText } = render(
      <RecoilRoot>
        <App />
      </RecoilRoot>,
    );
    const user = userEvent.setup();

    expect(await findByText('Authentication Required!')).toBeOnTheScreen();
    await user.press(await findByText('Add'));
    expect(authenticateAsync).toBeCalled();
    expect(queryByText('Authentication Required!')).not.toBeOnTheScreen();
  });

  it('should not start authenticate when authenticated', async () => {
    const { findByText } = render(
      <RecoilRoot initializeState={(snapshot) => snapshot.set(secureLevel, 1)}>
        <App />
      </RecoilRoot>,
    );
    const user = userEvent.setup();

    await user.press(await findByText('Add'));
    expect(authenticateAsync).not.toBeCalled();
  });
});
