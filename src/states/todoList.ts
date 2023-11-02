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
  effects: [asyncStorageEffect('TodoItems')],
});

export function useAddTodo() {
  return useRecoilCallback(({ set }) => (content: string) => {
    const trimmedContent = content.trim();
    if (trimmedContent.length <= 0) return;

    const id = uuid.v4() as string;
    set(todoItems, (items) => {
      const idx = items.findIndex((elem) => elem.id === id);
      return idx < 0 ? items.concat({ id, status: 'todo', content }) : items;
    });
  });
}

export function useDeleteTodo(id: string) {
  return useRecoilCallback(({ set }) => () => {
    set(todoItems, (items) => {
      const idx = items.findIndex((elem) => elem.id === id);
      return idx < 0 ? items : items.slice(0, idx).concat(items.slice(idx + 1));
    });
  });
}
