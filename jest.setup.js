import { View, SectionList } from 'react-native';

window.__TEST__ = true;

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.doMock('react-native-safe-area-context', () => {
  return {
    SafeAreaProvider: View,
    SafeAreaView: View,
  };
});

jest.doMock('react-native-keyboard-aware-scroll-view', () => {
  return {
    KeyboardAwareSectionList: SectionList,
  };
});
