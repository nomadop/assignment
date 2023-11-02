/// <reference types="@testing-library/jest-native" />
/// <reference types="nativewind/types" />
import 'react-native-gesture-handler';

declare module 'react-native-gesture-handler' {
  interface RectButtonProps {
    className: string;
  }
}
