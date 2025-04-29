import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [],
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        id: Date.now().toString(),
        text: action.payload.text,
        completed: false,
        dueDate: null,
      };
      state.tasks.push(newTask);
    },

    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },

    toggleComplete: (state, action) => {
      const task = state.tasks.find((task) => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },

    updateTask: (state, action) => {
      const { id, text, dueDate } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        if (text !== undefined) {
          task.text = text;
        }
        if (dueDate !== undefined) {
          task.dueDate = dueDate;
        }
      }
    },
  },
});

export const { addTask, deleteTask, toggleComplete, updateTask } =
  tasksSlice.actions;

export default tasksSlice.reducer;
