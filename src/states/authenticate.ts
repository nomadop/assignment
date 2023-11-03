import { authenticateAsync, getEnrolledLevelAsync, SecurityLevel } from 'expo-local-authentication';
import { atom, selector, useRecoilCallback } from 'recoil';

const secureLevel = atom<SecurityLevel>({
  key: 'SecureLevel',
  default: SecurityLevel.NONE,
});

export const isAuthenticated = selector({
  key: 'IsAuthenticated',
  get: ({ get }) => get(secureLevel) > SecurityLevel.NONE,
});

export function useAuthenticate() {
  return useRecoilCallback(({ snapshot, set }) => async () => {
    const currentSecureLevel = await snapshot.getPromise(secureLevel);
    if (currentSecureLevel === SecurityLevel.NONE) {
      await authenticateAsync({ promptMessage: 'Authenticate required before editing!' });
      const enrolledLevel = await getEnrolledLevelAsync();
      set(secureLevel, enrolledLevel);
    }
  });
}
