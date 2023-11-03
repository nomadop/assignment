import Todo from 'components/Todo/Todo';
import React, { createRef, forwardRef, useImperativeHandle, useMemo, useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { KeyboardAwareSectionList } from 'react-native-keyboard-aware-scroll-view';
import { useRecoilValue } from 'recoil';
import { todoItems, useAddTodo } from 'states/todoList';

export interface TodoListRef {
  startAdding(): void;
}

const TodoList = forwardRef<TodoListRef>((_props, ref) => {
  const [isAdding, setIsAdding] = useState(false);
  const todoList = useRecoilValue(todoItems);
  const addTodo = useAddTodo();
  const sections = useMemo(() => {
    // Append an empty text input at the bottom to let user add new item
    const todos = [...todoList.filter(({ status }) => status === 'todo'), ...(isAdding ? [null] : [])];
    const dones = todoList.filter(({ status }) => status === 'done');
    const data = [
      {
        title: 'Todo',
        data: todos,
      },
    ];
    if (dones.length > 0) {
      data.push({
        title: 'Done',
        data: dones,
      });
    }
    return data;
  }, [todoList, isAdding]);

  const inputRef = createRef<TextInput>();
  const scrollRef = createRef<KeyboardAwareSectionList>();
  const handleAddTodo = (content: string) => {
    if (inputRef.current) {
      inputRef.current.clear();
      addTodo(content.trim());
      if (typeof scrollRef.current?.scrollToFocusedInput === 'function') {
        scrollRef.current?.scrollToFocusedInput(inputRef.current);
      }
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      startAdding() {
        setIsAdding(true);
      },
    }),
    [setIsAdding],
  );

  return (
    <KeyboardAwareSectionList
      ref={scrollRef}
      className="flex-1"
      sections={sections}
      keyExtractor={(item) => item?.id ?? 'adding'}
      renderItem={({ item }) => {
        if (item !== null) {
          return <Todo item={item} />;
        }

        return (
          <View key="adding" className="ml-4 border-b border-slate-300 pl-2 pt-1 pb-3">
            <TextInput
              autoFocus
              ref={inputRef}
              testID="addTodoTextInput"
              className="text-2xl"
              blurOnSubmit={false}
              returnKeyType="next"
              onBlur={() => setIsAdding(false)}
              onSubmitEditing={({ nativeEvent: { text } }) => handleAddTodo(text)}
              underlineColorAndroid="transparent"
            />
          </View>
        );
      }}
      renderSectionHeader={({ section: { title } }) => (
        <View className="pt-2 bg-white">
          <Text className={`ml-4 text-3xl ${title === 'Done' ? 'text-slate-500' : 'text-black'}`}>{title}</Text>
        </View>
      )}
    />
  );
});

export default TodoList;
