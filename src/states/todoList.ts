import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import type { AtomEffect } from 'recoil';
import { atom, useRecoilCallback, DefaultValue } from 'recoil';

const asyncStorageEffect =
  <T>(key: string): AtomEffect<T> =>
  ({ setSelf, onSet }) => {
    setSelf(
      AsyncStorage.getItem(key).then(
        (savedValue) => (savedValue != null ? JSON.parse(savedValue) : new DefaultValue()), // Abort initialization if no value was stored
      ),
    );

    // Subscribe to state changes and persist them to AsyncStorage
    onSet((newValue, _, isReset) => {
      if (isReset) {
        AsyncStorage.removeItem(key);
      } else {
        AsyncStorage.setItem(key, JSON.stringify(newValue));
      }
    });
  };

export interface TodoItem {
  id: string;
  status: 'todo' | 'done';
  content: string;
}

export const todoItems = atom<TodoItem[]>({
  key: 'TodoItems',
  default: [],
  // There is an issue on recoil when multiple access async effect, it will cause unit test timeout.
  // On the current released version 0.7.7 it's not fixed yet.
  // https://github.com/facebookexperimental/Recoil/issues/2151
  effects: window.__TEST__ ? [] : [asyncStorageEffect('TodoItems')],
});

export function useAddTodo() {
  return useRecoilCallback(({ set }) => (content: string) => {
    if (content.length <= 0) return;

    const id = uuid.v4() as string;
    set(todoItems, (items) => {
      const idx = items.findIndex((elem) => elem.id === id);
      return idx < 0 ? items.concat({ id, status: 'todo', content }) : items;
    });
  });
}

export function useUpdateTodo() {
  return useRecoilCallback(({ set }) => (id: string, updater: (val: TodoItem) => TodoItem) => {
    set(todoItems, (items) => {
      const idx = items.findIndex((elem) => elem.id === id);
      return idx < 0 ? items : [...items.slice(0, idx), updater(items[idx]), ...items.slice(idx + 1)];
    });
  });
}

export function useDeleteTodo() {
  return useRecoilCallback(({ set }) => (id: string) => {
    set(todoItems, (items) => {
      const idx = items.findIndex((elem) => elem.id === id);
      return idx < 0 ? items : items.slice(0, idx).concat(items.slice(idx + 1));
    });
  });
}
