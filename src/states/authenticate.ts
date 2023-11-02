import { authenticateAsync, getEnrolledLevelAsync, SecurityLevel } from 'expo-local-authentication';
import { atom, useRecoilCallback } from 'recoil';

export const secureLevel = atom<SecurityLevel>({
  key: 'SecureLevel',
  default: SecurityLevel.NONE,
});

export function useWithAuthenticate() {
  return useRecoilCallback(({ snapshot, set }) => async () => {
    const currentSecureLevel = await snapshot.getPromise(secureLevel);
    if (currentSecureLevel === SecurityLevel.NONE) {
      await authenticateAsync({ promptMessage: 'Authenticate required before editing!' });
      const enrolledLevel = await getEnrolledLevelAsync();
      set(secureLevel, enrolledLevel);
    }
  });
}
