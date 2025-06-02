import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/classService';

const initialState = {
  classes: [],
  currentClass: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchClasses = createAsyncThunk(
  'classes/fetchAll',
  async () => {
    const response = await api.getClasses();
    return response.data;
  }
);

export const fetchClassById = createAsyncThunk(
  'classes/fetchById',
  async (classId) => {
    const response = await api.getClass(classId);
    return response.data;
  }
);

export const createClass = createAsyncThunk(
  'classes/create',
  async (classData) => {
    const response = await api.createClass(classData);
    return response.data;
  }
);

export const updateClass = createAsyncThunk(
  'classes/update',
  async ({ id, ...classData }) => {
    const response = await api.updateClass(id, classData);
    return response.data;
  }
);

export const deleteClass = createAsyncThunk(
  'classes/delete',
  async (classId) => {
    await api.deleteClass(classId);
    return classId;
  }
);

const classSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    clearCurrentClass: (state) => {
      state.currentClass = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Classes
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = action.payload;
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Fetch Class by ID
      .addCase(fetchClassById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClass = action.payload;
      })
      .addCase(fetchClassById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Create Class
      .addCase(createClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes.push(action.payload);
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Update Class
      .addCase(updateClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClass.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.classes.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.classes[index] = action.payload;
        }
        if (state.currentClass?.id === action.payload.id) {
          state.currentClass = action.payload;
        }
      })
      .addCase(updateClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Delete Class
      .addCase(deleteClass.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClass.fulfilled, (state, action) => {
        state.loading = false;
        state.classes = state.classes.filter(c => c.id !== action.payload);
        if (state.currentClass?.id === action.payload) {
          state.currentClass = null;
        }
      })
      .addCase(deleteClass.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearCurrentClass } = classSlice.actions;
export default classSlice.reducer;