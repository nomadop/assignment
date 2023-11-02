import React, { createRef, useEffect, useRef } from 'react';
import { Animated, DeviceEventEmitter, Keyboard, Text, View } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useWithAuthenticate } from 'states/authenticate';
import type { TodoItem } from 'states/todoList';
import { useDeleteTodo } from 'states/todoList';

interface Props {
  item: TodoItem;
}

function Todo({ item }: Props) {
  const fadeOut = useRef(new Animated.Value(1));
  const deleteTodo = useDeleteTodo(item.id);
  const swipeableRef = createRef<Swipeable>();
  const withAuthenticate = useWithAuthenticate();

  const handleDelete = () => {
    withAuthenticate().then(() => {
      Animated.timing(fadeOut.current, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => deleteTodo());
    });
  };
  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
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
        <Animated.View
          className="flex-1 origin-top"
          style={{ opacity: fadeOut.current, transform: [{ translateX: transDone }] }}>
          <RectButton className="w-screen px-1 flex-1 justify-center bg-green-400">
            <Text className="text-white text-2xt p-2.5 bg-transparent">Done</Text>
          </RectButton>
        </Animated.View>
        <Animated.View
          className="flex-1 origin-top"
          style={{ opacity: fadeOut.current, transform: [{ translateX: transDelete }] }}>
          <RectButton className="w-screen px-1 flex-1 justify-center bg-rose-600" onPress={handleDelete}>
            <Text className="text-white text-2xt p-2.5 bg-transparent">Delete</Text>
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('CLOSE_SWIPEABLE', (id?: string) => {
      if (swipeableRef.current && id !== item.id) {
        swipeableRef.current?.close();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [swipeableRef, item.id]);

  return (
    <Swipeable
      ref={swipeableRef}
      friction={1}
      overshootFriction={8}
      rightThreshold={80}
      renderRightActions={renderRightActions}
      onSwipeableWillOpen={() => {
        Keyboard.dismiss();
        DeviceEventEmitter.emit('CLOSE_SWIPEABLE', item.id);
      }}>
      <Animated.View
        className="h-10 ml-4 border-b border-slate-300 pl-2 justify-center"
        style={{ opacity: fadeOut.current }}>
        <Text className="text-2xl">{item.content}</Text>
      </Animated.View>
    </Swipeable>
  );
}

export default Todo;
