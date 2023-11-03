import type { TodoListRef } from 'components/TodoList/TodoList';
import TodoList from 'components/TodoList/TodoList';
import { StatusBar } from 'expo-status-bar';
import React, { createRef, Suspense } from 'react';
import { Pressable, Text, View, DeviceEventEmitter } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { isAuthenticated as isAuthenticatedSelector, useAuthenticate } from 'states/authenticate';

export function App() {
  const isAuthenticated = useRecoilValue(isAuthenticatedSelector);
  const authenticate = useAuthenticate();
  const todoListRef = createRef<TodoListRef>();

  const handlePress = () => {
    DeviceEventEmitter.emit('CLOSE_SWIPEABLE');
    authenticate().then(() => {
      todoListRef.current?.startAdding();
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
              <Pressable className="w-20 flex-row items-center px-4 py-2" onPress={handlePress}>
                <Icon size={32} name="add-circle" />
                <Text className="text-2xl pl-1">Add</Text>
              </Pressable>
              {!isAuthenticated && (
                <>
                  <Text className="text-slate-400">Authentication Required!</Text>
                  <View className="w-20" />
                </>
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
