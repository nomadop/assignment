import { render, userEvent } from '@testing-library/react-native';
import { App } from 'App';
import { authenticateAsync, getEnrolledLevelAsync } from 'expo-local-authentication';
import React from 'react';
import { Alert } from 'react-native';
import { RecoilRoot } from 'recoil';
import { isAuthenticated } from 'states/authenticate';

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
    const { findByText } = render(
      <RecoilRoot>
        <App />
      </RecoilRoot>,
    );
    const user = userEvent.setup();

    expect(await findByText('Unauthenticated')).toBeOnTheScreen();
    await user.press(await findByText('Add'));
    expect(authenticateAsync).toBeCalled();
    expect(await findByText('Secure level: 1')).toBeOnTheScreen();
  });

  it('should not start authenticate when authenticated', async () => {
    const { findByText } = render(
      <RecoilRoot initializeState={(snapshot) => snapshot.set(isAuthenticated, true)}>
        <App />
      </RecoilRoot>,
    );
    const user = userEvent.setup();

    await user.press(await findByText('Add'));
    expect(authenticateAsync).not.toBeCalled();
  });

  it('should alert message when failed to authenticated', async () => {
    (authenticateAsync as unknown as jest.SpyInstance).mockResolvedValue({ success: false });
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { findByText } = render(
      <RecoilRoot>
        <App />
      </RecoilRoot>,
    );
    const user = userEvent.setup();

    await user.press(await findByText('Add'));
    expect(alertSpy).toBeCalledWith(
      'Failed to authenticate!',
      'Authentication is required before you can add todo item.',
    );
  });
});
