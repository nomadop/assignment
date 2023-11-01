import { authenticateAsync, getEnrolledLevelAsync, SecurityLevel } from 'expo-local-authentication';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import TodoList from './components/TodoList/TodoList';

export default function App() {
  const [secureLevel, setSecureLevel] = useState<SecurityLevel>(SecurityLevel.NONE);

  useEffect(() => {
    authenticateAsync({
      promptMessage: 'test',
    })
      .then(() => {
        return getEnrolledLevelAsync();
      })
      .then((result) => {
        setSecureLevel(result);
      });
  }, []);

  return (
    <SafeAreaProvider>
      {secureLevel > 0 ? (
        <TodoList />
      ) : (
        <View className="flex-1 items-center justify-center bg-white">
          <Text>Authentication Required!</Text>
          <StatusBar style="auto" />
        </View>
      )}
    </SafeAreaProvider>
  );
}
