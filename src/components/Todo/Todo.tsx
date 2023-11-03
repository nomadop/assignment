import type { PropsWithChildren } from 'react';
import React, { createRef, useEffect, useRef, useState } from 'react';
import { Alert, Animated, DeviceEventEmitter, Keyboard, Platform, Text, View } from 'react-native';
import { RectButton, TextInput } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { useRecoilValue } from 'recoil';
import { isAuthenticated as isAuthenticatedSelector, useAuthenticate } from 'states/authenticate';
import type { TodoItem } from 'states/todoList';
import { useDeleteTodo, useUpdateTodo } from 'states/todoList';

type RightActionProps = PropsWithChildren<{
  progress: Animated.AnimatedInterpolation<number>;
  fadeOut: Animated.AnimatedValue;
  x: number;
}>;

function RightAction({ progress, x, children, fadeOut }: RightActionProps) {
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [x, 0],
  });
  return (
    <Animated.View className="flex-1 origin-top" style={{ opacity: fadeOut, transform: [{ translateX }] }}>
      {children}
    </Animated.View>
  );
}

interface Props {
  item: TodoItem;
}

function Todo({ item }: Props) {
  const fadeOut = useRef(new Animated.Value(1));
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();
  const swipeableRef = createRef<Swipeable>();
  const authenticate = useAuthenticate();
  const isAuthenticated = useRecoilValue(isAuthenticatedSelector);
  const [input, setInput] = useState(item.content);

  const handleFocus = () => {
    // close opened swipeable actions when start editing
    DeviceEventEmitter.emit('CLOSE_SWIPEABLE', item.id);
  };

  const toggleState = () => {
    authenticate()
      .then(() => {
        // fade out before execute update state action
        Animated.timing(fadeOut.current, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          const newState = item.status === 'todo' ? 'done' : 'todo';
          updateTodo(item.id, (val) => ({ ...val, status: newState }));
        });
      })
      .catch(() => {
        Alert.alert('Failed to authenticate!', 'Authentication is required before you can update todo item.');
      });
  };

  const handleDelete = () => {
    authenticate()
      .then(() => {
        // fade out before execute delete action
        Animated.timing(fadeOut.current, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(() => deleteTodo(item.id));
      })
      .catch(() => {
        Alert.alert('Failed to authenticate!', 'Authentication is required before you can delete todo item..');
      });
  };

  const handleUpdate = (content: string) => {
    // if delete all content when submitting then execute delete action, otherwise update the content
    if (content.length > 0) {
      updateTodo(item.id, (val) => ({ ...val, content: content.trim() }));
    } else {
      handleDelete();
    }
  };

  const renderRightActions = (progress: Animated.AnimatedInterpolation<number>) => {
    return (
      <View className="w-40 flex-row">
        <RightAction progress={progress} x={160} fadeOut={fadeOut.current}>
          <RectButton
            className={`w-screen px-1 flex-1 justify-center ${
              item.status === 'done' ? 'bg-slate-300' : 'bg-green-400'
            }`}
            onPress={toggleState}>
            <Text className="text-white text-2xt p-2.5 bg-transparent">{item.status === 'done' ? 'Undo' : 'Done'}</Text>
          </RectButton>
        </RightAction>
        <RightAction progress={progress} x={80} fadeOut={fadeOut.current}>
          <RectButton className="w-screen px-1 flex-1 justify-center bg-rose-600" onPress={handleDelete}>
            <Text className="text-white text-2xt p-2.5 bg-transparent">Delete</Text>
          </RectButton>
        </RightAction>
      </View>
    );
  };

  useEffect(() => {
    // when CLOSE_SWIPEABLE event trigger, check if it's send by other swipeable item. If so, close this one.
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
      testID="todoItem"
      overshootFriction={8}
      rightThreshold={80}
      renderRightActions={renderRightActions}
      onSwipeableWillOpen={() => {
        // dismiss keyboard and emit CLOSE_SWIPEABLE event to close other opened swipeable item
        Keyboard.dismiss();
        DeviceEventEmitter.emit('CLOSE_SWIPEABLE', item.id);
      }}>
      <Animated.View
        className={`ml-4 border-b border-slate-300 pl-2 ${Platform.select({
          // vertical align of TextInput text is different between IOS and Android, adjust it with different padding.
          ios: 'pt-1 pb-3',
          android: 'py-2',
        })} pr-4 justify-center`}
        style={{ opacity: fadeOut.current }}>
        <TextInput
          multiline
          blurOnSubmit
          editable={isAuthenticated}
          scrollEnabled={false}
          onFocus={handleFocus}
          className={`text-2xl ${item.status === 'done' ? 'text-slate-500' : 'text-black'}`}
          value={input}
          returnKeyType="done"
          onChangeText={setInput}
          onSubmitEditing={({ nativeEvent: { text } }) => handleUpdate(text.trim())}
        />
      </Animated.View>
    </Swipeable>
  );
}

export default Todo;
