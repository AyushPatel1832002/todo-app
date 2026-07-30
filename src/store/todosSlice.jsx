import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Status values: 'todo' | 'in-progress' | 'done'

const loadFromStorage = () => {
  try {
    const raw = localStorage.getItem('ledger-todos');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const initialState = {
  items: loadFromStorage(),
  editingId: null,
};

const persist = (items) => {
  try {
    localStorage.setItem('ledger-todos', JSON.stringify(items));
  } catch (e) {
    // localStorage not available — fail silently
  }
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // CREATE
    addTodo: {
      reducer(state, action) {
        state.items.unshift(action.payload);
        persist(state.items);
      },
      prepare({ title, description, status }) {
        return {
          payload: {
            id: uuidv4(),
            title: title.trim(),
            description: description.trim(),
            status: status || 'todo',        // 'todo' | 'in-progress' | 'done'
            completed: status === 'done',    // keep backwards compat
            createdAt: new Date().toISOString(),
          },
        };
      },
    },
    // UPDATE
    updateTodo(state, action) {
      const { id, title, description, status } = action.payload;
      const todo = state.items.find((t) => t.id === id);
      if (todo) {
        todo.title = title.trim();
        todo.description = description.trim();
        todo.status = status || todo.status;
        todo.completed = todo.status === 'done';
      }
      state.editingId = null;
      persist(state.items);
    },
    // DELETE
    deleteTodo(state, action) {
      state.items = state.items.filter((t) => t.id !== action.payload);
      if (state.editingId === action.payload) state.editingId = null;
      persist(state.items);
    },
    // CHANGE STATUS
    setStatus(state, action) {
      const { id, status } = action.payload;
      const todo = state.items.find((t) => t.id === id);
      if (todo) {
        todo.status = status;
        todo.completed = status === 'done';
      }
      persist(state.items);
    },
    // TOGGLE (legacy keep)
    toggleComplete(state, action) {
      const todo = state.items.find((t) => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        todo.status = todo.completed ? 'done' : 'todo';
      }
      persist(state.items);
    },
    startEditing(state, action) {
      state.editingId = action.payload;
    },
    cancelEditing(state) {
      state.editingId = null;
    },
  },
});

export const {
  addTodo,
  updateTodo,
  deleteTodo,
  setStatus,
  toggleComplete,
  startEditing,
  cancelEditing,
} = todosSlice.actions;

// Selectors
export const selectAllTodos    = (state) => state.todos.items;
export const selectEditingId   = (state) => state.todos.editingId;
export const selectEditingTodo = (state) =>
  state.todos.items.find((t) => t.id === state.todos.editingId) || null;

export default todosSlice.reducer;
