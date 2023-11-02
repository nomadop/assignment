import TodoList from 'components/TodoList/TodoList';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, Suspense } from 'react';
import { Pressable, Text, View, Keyboard, DeviceEventEmitter } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { RecoilRoot } from 'recoil';
import { useWithAuthenticate } from 'states/authenticate';

export function App() {
  const [isAdding, setIsAdding] = useState(false);

  const withAuthenticate = useWithAuthenticate();

  const handlePress = () => {
    DeviceEventEmitter.emit('CLOSE_SWIPEABLE');
    withAuthenticate().then(() => {
      setIsAdding(true);
    });
  };

  useEffect(() => {
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsAdding(false);
    });

    return () => {
      hideSubscription.remove();
    };
  }, []);

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
            <TodoList isAdding={isAdding} />
            <View>
              <Pressable className="flex-row items-center px-4 py-2" onPress={handlePress}>
                <Icon size={32} name="add-circle" />
                <Text className="text-2xl pl-1">Add</Text>
              </Pressable>
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
