import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/teacherService';

const initialState = {
  teachers: [],
  currentTeacher: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchTeachers = createAsyncThunk(
  'teachers/fetchAll',
  async () => {
    const response = await api.getTeachers();
    return response.data;
  }
);

export const fetchTeacherById = createAsyncThunk(
  'teachers/fetchById',
  async (teacherId) => {
    const response = await api.getTeacher(teacherId);
    return response.data;
  }
);

export const createTeacher = createAsyncThunk(
  'teachers/create',
  async (teacherData) => {
    const response = await api.createTeacher(teacherData);
    return response.data;
  }
);

export const updateTeacher = createAsyncThunk(
  'teachers/update',
  async ({ id, ...teacherData }) => {
    const response = await api.updateTeacher(id, teacherData);
    return response.data;
  }
);

export const deleteTeacher = createAsyncThunk(
  'teachers/delete',
  async (teacherId) => {
    await api.deleteTeacher(teacherId);
    return teacherId;
  }
);

const teacherSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {
    clearCurrentTeacher: (state) => {
      state.currentTeacher = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Teachers
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false;
        state.teachers = action.payload;
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Fetch Teacher by ID
      .addCase(fetchTeacherById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeacherById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTeacher = action.payload;
      })
      
      // Create Teacher
      .addCase(createTeacher.fulfilled, (state, action) => {
        state.teachers.push(action.payload);
      })
      
      // Update Teacher
      .addCase(updateTeacher.fulfilled, (state, action) => {
        const index = state.teachers.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.teachers[index] = action.payload;
        }
        if (state.currentTeacher?.id === action.payload.id) {
          state.currentTeacher = action.payload;
        }
      })
      
      // Delete Teacher
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        state.teachers = state.teachers.filter(t => t.id !== action.payload);
      });
  }
});

export const { clearCurrentTeacher } = teacherSlice.actions;
export default teacherSlice.reducer;