import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/studentService';

const initialState = {
  students: [],
  currentStudent: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchStudents = createAsyncThunk(
  'students/fetchAll',
  async () => {
    const response = await api.getStudents();
    return response.data;
  }
);

export const fetchStudentById = createAsyncThunk(
  'students/fetchById',
  async (studentId) => {
    const response = await api.getStudent(studentId);
    return response.data;
  }
);

export const createStudent = createAsyncThunk(
  'students/create',
  async (studentData) => {
    const response = await api.createStudent(studentData);
    return response.data;
  }
);

export const updateStudent = createAsyncThunk(
  'students/update',
  async ({ id, ...studentData }) => {
    const response = await api.updateStudent(id, studentData);
    return response.data;
  }
);

export const deleteStudent = createAsyncThunk(
  'students/delete',
  async (studentId) => {
    await api.deleteStudent(studentId);
    return studentId;
  }
);

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearCurrentStudent: (state) => {
      state.currentStudent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Fetch Student by ID
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStudent = action.payload;
      })
      
      // Create Student
      .addCase(createStudent.fulfilled, (state, action) => {
        state.students.push(action.payload);
      })
      
      // Update Student
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.students.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.students[index] = action.payload;
        }
        if (state.currentStudent?.id === action.payload.id) {
          state.currentStudent = action.payload;
        }
      })
      
      // Delete Student
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter(s => s.id !== action.payload);
      });
  }
});

export const { clearCurrentStudent } = studentSlice.actions;
export default studentSlice.reducer;