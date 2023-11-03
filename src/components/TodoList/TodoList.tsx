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
  const data = useMemo(() => {
    return [
      {
        title: 'Todo',
        data: [...todoList.filter(({ status }) => status === 'todo'), ...(isAdding ? [null] : [])],
      },
      {
        title: 'Done',
        data: todoList.filter(({ status }) => status === 'done'),
      },
    ];
  }, [todoList, isAdding]);
  const inputRef = createRef<TextInput>();
  const scrollRef = createRef<KeyboardAwareSectionList>();
  const handleAddTodo = (content: string) => {
    if (inputRef.current) {
      inputRef.current.clear();
      addTodo(content.trim());
      scrollRef.current?.scrollToFocusedInput(inputRef.current);
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
      sections={data}
      keyExtractor={(item) => item?.id ?? 'adding'}
      renderItem={({ item }) => {
        if (item !== null) {
          return <Todo item={item} />;
        }

        return (
          <View key="adding" className="h-12 ml-4 border-b border-slate-300 pl-2 pt-1 pb-3">
            <TextInput
              autoFocus
              ref={inputRef}
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
      renderSectionHeader={({ section: { title } }) => <Text className="ml-4 text-3xl bg-white">{title}</Text>}
    />
  );
});

export default TodoList;
