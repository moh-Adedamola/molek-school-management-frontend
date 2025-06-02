import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/subjectService';

const initialState = {
  subjects: [],
  currentSubject: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchSubjects = createAsyncThunk(
  'subjects/fetchAll',
  async () => {
    const response = await api.getSubjects();
    return response.data;
  }
);

export const fetchSubjectById = createAsyncThunk(
  'subjects/fetchById',
  async (subjectId) => {
    const response = await api.getSubject(subjectId);
    return response.data;
  }
);

export const createSubject = createAsyncThunk(
  'subjects/create',
  async (subjectData) => {
    const response = await api.createSubject(subjectData);
    return response.data;
  }
);

export const updateSubject = createAsyncThunk(
  'subjects/update',
  async ({ id, ...subjectData }) => {
    const response = await api.updateSubject(id, subjectData);
    return response.data;
  }
);

export const deleteSubject = createAsyncThunk(
  'subjects/delete',
  async (subjectId) => {
    await api.deleteSubject(subjectId);
    return subjectId;
  }
);

const subjectSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    clearCurrentSubject: (state) => {
      state.currentSubject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Subjects
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Fetch Subject by ID
      .addCase(fetchSubjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubject = action.payload;
      })
      .addCase(fetchSubjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Create Subject
      .addCase(createSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects.push(action.payload);
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Update Subject
      .addCase(updateSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.subjects.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.subjects[index] = action.payload;
        }
        if (state.currentSubject?.id === action.payload.id) {
          state.currentSubject = action.payload;
        }
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Delete Subject
      .addCase(deleteSubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.loading = false;
        state.subjects = state.subjects.filter(s => s.id !== action.payload);
        if (state.currentSubject?.id === action.payload) {
          state.currentSubject = null;
        }
      })
      .addCase(deleteSubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearCurrentSubject } = subjectSlice.actions;
export default subjectSlice.reducer;