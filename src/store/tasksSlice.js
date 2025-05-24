import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { database, auth } from "../firebase/firebaseConfig";
import {
  ref,
  push,
  set,
  update,
  remove,
  onValue,
  off,
  serverTimestamp,
} from "firebase/database";

export const fetchTasksFromFirebase = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { dispatch, getState }) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      return [];
    }
    const tasksRef = ref(database, `tasks/${userId}`);

    return new Promise((resolve, reject) => {
      onValue(
        tasksRef,
        (snapshot) => {
          const data = snapshot.val();
          const loadedTasks = data
            ? Object.keys(data).map((key) => ({
                id: key,
                ...data[key],
              }))
            : [];
          dispatch(setTasks(loadedTasks));
          resolve(loadedTasks);
        },
        (error) => {
          reject(error);
        },
        { onlyOnce: true }
      );
    });
  }
);

export const addTaskToFirebase = createAsyncThunk(
  "tasks/addTaskToFirebase",
  async (taskData, { getState }) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("No user logged in");

    const tasksUserRef = ref(database, `tasks/${userId}`);
    const newTaskRef = push(tasksUserRef);

    const newTask = {
      id: newTaskRef.key,
      text: taskData.text,
      completed: false,
      dueDate: null,
      locationCoords: null,
      locationAddress: null,
      createdAt: serverTimestamp(),
    };
    await set(newTaskRef, newTask);
    return newTask;
  }
);

export const updateTaskInFirebase = createAsyncThunk(
  "tasks/updateTaskInFirebase",
  async (taskUpdate, { getState }) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("No user logged in");
    if (!taskUpdate.id) throw new Error("Task ID is required for update");

    const taskRef = ref(database, `tasks/${userId}/${taskUpdate.id}`);

    const updates = {};
    if (taskUpdate.text !== undefined) updates.text = taskUpdate.text;
    if (taskUpdate.completed !== undefined)
      updates.completed = taskUpdate.completed;
    if (taskUpdate.dueDate !== undefined) updates.dueDate = taskUpdate.dueDate;
    if (taskUpdate.locationCoords !== undefined)
      updates.locationCoords = taskUpdate.locationCoords;
    if (taskUpdate.locationAddress !== undefined)
      updates.locationAddress = taskUpdate.locationAddress;

    await update(taskRef, updates);
    return { id: taskUpdate.id, ...updates };
  }
);

export const deleteTaskFromFirebase = createAsyncThunk(
  "tasks/deleteTaskFromFirebase",
  async (taskId, { getState }) => {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("No user logged in");

    const taskRef = ref(database, `tasks/${userId}/${taskId}`);
    await remove(taskRef);
    return taskId;
  }
);

const initialState = {
  tasks: [],
  status: "idle",
  error: null,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
      state.status = "succeeded";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(addTaskToFirebase.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addTaskToFirebase.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(addTaskToFirebase.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(updateTaskInFirebase.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateTaskInFirebase.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(updateTaskInFirebase.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(deleteTaskFromFirebase.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteTaskFromFirebase.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(deleteTaskFromFirebase.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setTasks } = tasksSlice.actions;

export default tasksSlice.reducer;
