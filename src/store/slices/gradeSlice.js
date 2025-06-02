import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Simulated API calls
const fetchGradesApi = async (params) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data based on class and subject
  const { classId, subjectId, term } = params

  // Generate mock grades for the class
  return [
    {
      id: 1,
      studentId: 1,
      studentName: "John Doe",
      classId,
      subjectId,
      term,
      ca: 25, // out of 30
      exam: 60, // out of 70
      total: 85, // out of 100
      previousTerms: term > 1 ? [{ term: 1, total: 78 }, term > 2 ? { term: 2, total: 82 } : null].filter(Boolean) : [],
    },
    {
      id: 2,
      studentId: 2,
      studentName: "Jane Smith",
      classId,
      subjectId,
      term,
      ca: 28,
      exam: 65,
      total: 93,
      previousTerms: term > 1 ? [{ term: 1, total: 88 }, term > 2 ? { term: 2, total: 90 } : null].filter(Boolean) : [],
    },
    // Add more mock student grades as needed
  ]
}

const updateGradeApi = async (gradeData) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Calculate total
  const total = (gradeData.ca || 0) + (gradeData.exam || 0)

  // Return the updated grade
  return {
    ...gradeData,
    total,
  }
}

// Async thunks
export const fetchGrades = createAsyncThunk("grades/fetchGrades", async (params, { rejectWithValue }) => {
  try {
    const grades = await fetchGradesApi(params)
    return { grades, params }
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const updateGrade = createAsyncThunk("grades/updateGrade", async (gradeData, { rejectWithValue }) => {
  try {
    const grade = await updateGradeApi(gradeData)
    return grade
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const initialState = {
  grades: [],
  currentClass: null,
  currentSubject: null,
  currentTerm: 1,
  loading: false,
  error: null,
}

const gradesSlice = createSlice({
  name: "grades",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentFilters: (state, action) => {
      const { classId, subjectId, term } = action.payload
      state.currentClass = classId
      state.currentSubject = subjectId
      state.currentTerm = term
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch grades cases
      .addCase(fetchGrades.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGrades.fulfilled, (state, action) => {
        state.loading = false
        state.grades = action.payload.grades
        state.currentClass = action.payload.params.classId
        state.currentSubject = action.payload.params.subjectId
        state.currentTerm = action.payload.params.term
      })
      .addCase(fetchGrades.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch grades"
      })
      // Update grade cases
      .addCase(updateGrade.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateGrade.fulfilled, (state, action) => {
        state.loading = false
        const index = state.grades.findIndex((grade) => grade.id === action.payload.id)
        if (index !== -1) {
          state.grades[index] = action.payload
        }
      })
      .addCase(updateGrade.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to update grade"
      })
  },
})

export const { clearError, setCurrentFilters } = gradesSlice.actions

export default gradesSlice.reducer
