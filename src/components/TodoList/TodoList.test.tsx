import { act, render, userEvent, fireEvent, waitFor } from '@testing-library/react-native';
import type { TodoListRef } from 'components/TodoList/TodoList';
import TodoList from 'components/TodoList/TodoList';
import React from 'react';
import type { MutableSnapshot } from 'recoil';
import { RecoilRoot } from 'recoil';
import { secureLevel } from 'states/authenticate';
import type { TodoItem } from 'states/todoList';
import { todoItems } from 'states/todoList';

describe('TodoList', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should show todos', async () => {
    const initializeState = (snapshot: MutableSnapshot) => {
      snapshot.set(secureLevel, 1);
      snapshot.set(todoItems, [
        { id: '1', status: 'todo', content: 'do something' },
        { id: '2', status: 'done', content: 'done thing' },
      ] as TodoItem[]);
    };
    const { findByDisplayValue } = render(
      <RecoilRoot initializeState={initializeState}>
        <TodoList />
      </RecoilRoot>,
    );

    expect(await findByDisplayValue('do something')).toHaveStyle({ color: '#000' });
    expect(await findByDisplayValue('done thing')).toHaveStyle({ color: '#64748b' });
  });

  it('should add todo', async () => {
    const initializeState = (snapshot: MutableSnapshot) => {
      snapshot.set(secureLevel, 1);
    };
    let ref: TodoListRef | null;
    const { findByDisplayValue, findByTestId, findAllByTestId } = render(
      <RecoilRoot initializeState={initializeState}>
        <TodoList
          ref={(el) => {
            ref = el;
          }}
        />
      </RecoilRoot>,
    );

    const user = userEvent.setup();
    await act(() => ref?.startAdding());
    await user.type(await findByTestId('addTodoTextInput'), 'do some other thing', { submitEditing: true });
    expect(await findByDisplayValue('do some other thing')).toBeOnTheScreen();
    expect(await findAllByTestId('todoItem')).toHaveLength(1);

    await act(() => ref?.startAdding());
    await user.type(await findByTestId('addTodoTextInput'), 'do some another thing', { submitEditing: true });
    expect(await findByDisplayValue('do some another thing')).toBeOnTheScreen();
    expect(await findAllByTestId('todoItem')).toHaveLength(2);

    await act(() => ref?.startAdding());
    await user.type(await findByTestId('addTodoTextInput'), '      ', { submitEditing: true });
    expect(await findAllByTestId('todoItem')).toHaveLength(2);
  });

  it('should update todo', async () => {
    const initializeState = (snapshot: MutableSnapshot) => {
      snapshot.set(secureLevel, 1);
      snapshot.set(todoItems, [{ id: '1', status: 'todo', content: 'do something' }] as TodoItem[]);
    };
    const { findByDisplayValue } = render(
      <RecoilRoot initializeState={initializeState}>
        <TodoList />
      </RecoilRoot>,
    );

    const user = userEvent.setup();
    await user.type(await findByDisplayValue('do something'), ' later', { submitEditing: true });
    expect(await findByDisplayValue('do something later')).toBeOnTheScreen();
  });

  it('should toggle todo', async () => {
    const initializeState = (snapshot: MutableSnapshot) => {
      snapshot.set(secureLevel, 1);
      snapshot.set(todoItems, [{ id: '1', status: 'todo', content: 'do something' }] as TodoItem[]);
    };
    const { findByDisplayValue, findByText } = render(
      <RecoilRoot initializeState={initializeState}>
        <TodoList />
      </RecoilRoot>,
    );

    await act(async () => {
      await fireEvent(await findByText('Done'), 'onPress');
    });
    await waitFor(async () => {
      expect(await findByDisplayValue('do something')).toHaveStyle({ color: '#64748b' });
    });

    await act(async () => {
      await fireEvent(await findByText('Undo'), 'onPress');
    });
    await waitFor(async () => {
      expect(await findByDisplayValue('do something')).toHaveStyle({ color: '#000' });
    });
  });

  it('should delete todo', async () => {
    const initializeState = (snapshot: MutableSnapshot) => {
      snapshot.set(secureLevel, 1);
      snapshot.set(todoItems, [{ id: '1', status: 'todo', content: 'do something' }] as TodoItem[]);
    };
    const { findByDisplayValue, findByText } = render(
      <RecoilRoot initializeState={initializeState}>
        <TodoList />
      </RecoilRoot>,
    );

    await act(async () => {
      await fireEvent(await findByText('Delete'), 'onPress');
    });
    await waitFor(async () => {
      expect(await findByDisplayValue('do something')).not.toBeOnTheScreen();
    });
  });
});
