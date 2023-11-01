import React from 'react';
import { SectionList, View, Text, Animated } from 'react-native';
import { GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { SafeAreaView } from 'react-native-safe-area-context';

const DATA = [
  {
    title: 'Todo',
    data: ['Pizza', 'Burger', 'Risotto'],
  },
  {
    title: 'Done',
    data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
  },
];

function TodoList() {
  const renderRightActions = (progress) => {
    const transDone = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [160, 0],
    });
    const transDelete = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [80, 0],
    });
    return (
      <View className="w-40 flex-row">
        <Animated.View className="flex-1" style={{ transform: [{ translateX: transDone }] }}>
          <RectButton className="w-screen px-1 flex-1 justify-center bg-green-400">
            <Text className="text-white text-2xt p-2.5 bg-transparent">Done</Text>
          </RectButton>
        </Animated.View>
        <Animated.View className="flex-1" style={{ transform: [{ translateX: transDelete }] }}>
          <RectButton className="w-screen px-1 flex-1 justify-center bg-rose-600">
            <Text className="text-white text-2xt p-2.5 bg-transparent">Delete</Text>
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaView className="flex-1 bg-white">
        <SectionList
          sections={DATA}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <Swipeable friction={1} overshootFriction={8} rightThreshold={80} renderRightActions={renderRightActions}>
              <View className="ml-4 border-b border-slate-300 pl-2 py-2">
                <Text className="text-2xl">{item}</Text>
              </View>
            </Swipeable>
          )}
          renderSectionHeader={({ section: { title } }) => <Text className="ml-4 text-3xl bg-white">{title}</Text>}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default TodoList;
