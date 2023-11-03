import type { TodoListRef } from 'components/TodoList/TodoList';
import TodoList from 'components/TodoList/TodoList';
import { StatusBar } from 'expo-status-bar';
import React, { createRef, Suspense } from 'react';
import { Alert, DeviceEventEmitter, Pressable, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { RecoilRoot, useRecoilValue } from 'recoil';
import {
  secureLevel as secureLevelState,
  isAuthenticated as isAuthenticatedState,
  useAuthenticate,
} from 'states/authenticate';

export function App() {
  const isAuthenticated = useRecoilValue(isAuthenticatedState);
  const secureLevel = useRecoilValue(secureLevelState);
  const authenticate = useAuthenticate();
  const todoListRef = createRef<TodoListRef>();

  const handlePress = () => {
    DeviceEventEmitter.emit('CLOSE_SWIPEABLE');
    authenticate()
      .then(() => {
        todoListRef.current?.startAdding();
      })
      .catch(() => {
        Alert.alert('Failed to authenticate!', 'Authentication is required before you can add todo item.');
      });
  };

  return (
    <Suspense
      fallback={
        <View className="flex-1 items-center justify-center bg-white">
          <Text>Loading...</Text>
        </View>
      }>
      <SafeAreaProvider>
        <GestureHandlerRootView className="flex-1">
          <SafeAreaView className="grow bg-white">
            <TodoList ref={todoListRef} />
            <View className="flex-row justify-between items-center">
              <Pressable className="flex-row items-center px-4 py-2" onPress={handlePress}>
                <Icon size={32} name="add-circle" />
                <Text className="text-2xl pl-1">Add</Text>
              </Pressable>
              {isAuthenticated ? (
                <Text className="text-green-400 px-4">Secure level: {secureLevel}</Text>
              ) : (
                <Text className="text-rose-400 px-4" onPress={() => authenticate().catch(() => {})}>
                  Unauthenticated
                </Text>
              )}
            </View>
          </SafeAreaView>
        </GestureHandlerRootView>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </Suspense>
  );
}

export default function () {
  return (
    <RecoilRoot>
      <App />
    </RecoilRoot>
  );
}
