import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import gradeService from "../../api/gradeService"

// Async thunks
export const fetchGrades = createAsyncThunk(
  "grades/fetchGrades",
  async ({ classId, subjectId, termId, sessionId }, { rejectWithValue }) => {
    try {
      return await gradeService.getGrades(classId, subjectId, { termId, sessionId })
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const saveGrades = createAsyncThunk("grades/saveGrades", async (gradesData, { rejectWithValue }) => {
  try {
    return await gradeService.saveGrades(gradesData)
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const fetchReportCards = createAsyncThunk(
  "grades/fetchReportCards",
  async ({ classId, termId, sessionId }, { rejectWithValue }) => {
    try {
      return await gradeService.generateReportCards(classId, { termId, sessionId })
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const fetchStudentReportCard = createAsyncThunk(
  "grades/fetchStudentReportCard",
  async ({ studentId, termId, sessionId }, { rejectWithValue }) => {
    try {
      return await gradeService.getStudentReportCard(studentId, { termId, sessionId })
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const fetchGradeStatistics = createAsyncThunk(
  "grades/fetchGradeStatistics",
  async ({ termId, sessionId }, { rejectWithValue }) => {
    try {
      return await gradeService.getGradeStatistics({ termId, sessionId })
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Initial state
const initialState = {
  grades: [],
  reportCards: [],
  currentReportCard: null,
  statistics: null,
  isLoading: false,
  error: null,
}

// Slice
const gradeSlice = createSlice({
  name: "grades",
  initialState,
  reducers: {
    updateGrade: (state, action) => {
      const { id, ca, exam } = action.payload;
      const gradeIndex = state.grades.findIndex(grade => grade.id === id);
      if (gradeIndex !== -1) {
        state.grades[gradeIndex] = {
          ...state.grades[gradeIndex],
          ca,
          exam,
          total: ca + exam
        };
      }
    },
    clearGrades: (state) => {
      state.grades = []
    },
    clearReportCards: (state) => {
      state.reportCards = []
    },
    clearCurrentReportCard: (state) => {
      state.currentReportCard = null
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchGrades
      .addCase(fetchGrades.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchGrades.fulfilled, (state, action) => {
        state.isLoading = false
        state.grades = action.payload
      })
      .addCase(fetchGrades.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // saveGrades
      .addCase(saveGrades.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(saveGrades.fulfilled, (state, action) => {
        state.isLoading = false
        // Update grades if needed
        if (action.payload.grades) {
          state.grades = action.payload.grades
        }
      })
      .addCase(saveGrades.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // fetchReportCards
      .addCase(fetchReportCards.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchReportCards.fulfilled, (state, action) => {
        state.isLoading = false
        state.reportCards = action.payload
      })
      .addCase(fetchReportCards.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // fetchStudentReportCard
      .addCase(fetchStudentReportCard.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStudentReportCard.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentReportCard = action.payload
      })
      .addCase(fetchStudentReportCard.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // fetchGradeStatistics
      .addCase(fetchGradeStatistics.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchGradeStatistics.fulfilled, (state, action) => {
        state.isLoading = false
        state.statistics = action.payload
      })
      .addCase(fetchGradeStatistics.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { updateGrade, clearGrades, clearReportCards, clearCurrentReportCard } = gradeSlice.actions

export default gradeSlice.reducer