import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Todo {
  id: string;
  title: string;
  text: string;
  completed: boolean;
  dueDate?: string;      // Date butoir (optionnelle)
  createdAt: string;     // Date de création
  category?: string;     // Catégorie de la todo (optionnelle)
  color?: string;        // Couleur associée à la catégorie (optionnelle)
}

interface TodosState {
  todos: Todo[];
}

const initialState: TodosState = {
  todos: [],
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (
      state,
      action: PayloadAction<{
        title: string;
        text: string;
        dueDate?: string;
        category?: string;
        color?: string;
      }>
    ) => {
      state.todos.push({
        id: Date.now().toString(),
        title: action.payload.title,
        text: action.payload.text,
        completed: false,
        dueDate: action.payload.dueDate,
        createdAt: new Date().toISOString(),
        category: action.payload.category,
        color: action.payload.color,
      });
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) todo.completed = !todo.completed;
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(t => t.id !== action.payload);
    },
    removeTodosByCategory: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.category !== action.payload);
    },
    removeAllTodos: (state) => {
      state.todos = [];
    },
    editTodo: (state, action: PayloadAction<Partial<Todo> & { id: string }>) => {
      const todo = state.todos.find(t => t.id === action.payload.id);
      if (todo) {
        Object.assign(todo, action.payload);
      }
    },
  },
});

export const { addTodo, toggleTodo, removeTodo, removeTodosByCategory, removeAllTodos, editTodo } = todosSlice.actions;
export default todosSlice.reducer;