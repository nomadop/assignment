import { authenticateAsync, getEnrolledLevelAsync, SecurityLevel } from 'expo-local-authentication';
import { atom, useRecoilCallback } from 'recoil';

export const secureLevel = atom<SecurityLevel>({
  key: 'SecureLevel',
  default: SecurityLevel.NONE,
});

export const isAuthenticated = atom<boolean>({
  key: 'IsAuthenticated',
  default: false,
});

export function useAuthenticate() {
  return useRecoilCallback(({ snapshot, set }) => async () => {
    const currentAuthenticated = await snapshot.getPromise(isAuthenticated);
    if (!currentAuthenticated) {
      const authenticationResult = await authenticateAsync({ promptMessage: 'Authenticate required before editing!' });
      if (authenticationResult.success) {
        const enrolledLevel = await getEnrolledLevelAsync();
        set(secureLevel, enrolledLevel);
        set(isAuthenticated, true);
      } else {
        throw new Error('Failed to authenticate!');
      }
    }
  });
}
