import Todo from 'components/Todo/Todo';
import React, { createRef, useMemo } from 'react';
import { SectionList, View, Text, TextInput } from 'react-native';
import { useRecoilValue } from 'recoil';
import type { TodoItem } from 'states/todoList';
import { todoItems, useAddTodo } from 'states/todoList';

interface Props {
  isAdding: boolean;
}

function TodoList({ isAdding }: Props) {
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

  return (
    <SectionList<TodoItem | null>
      className="flex-1"
      sections={data}
      keyExtractor={(item) => item?.id ?? 'adding'}
      renderItem={({ item }) => {
        if (item !== null) {
          return <Todo item={item} />;
        }

        return (
          <View key="adding" className="ml-4 border-b border-slate-300 pl-2 py-2">
            <TextInput
              autoFocus
              ref={inputRef}
              blurOnSubmit={false}
              onSubmitEditing={({ nativeEvent: { text } }) => {
                inputRef.current?.clear();
                addTodo(text);
              }}
              underlineColorAndroid="transparent"
            />
          </View>
        );
      }}
      renderSectionHeader={({ section: { title } }) => <Text className="ml-4 text-3xl bg-white">{title}</Text>}
    />
  );
}

export default TodoList;
