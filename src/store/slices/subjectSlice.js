import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Simulated API calls
const fetchSubjectsApi = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data
  return [
    {
      id: 1,
      name: "Mathematics",
      code: "MATH",
      classes: ["JSS1A", "JSS1B", "JSS2A", "SS1A", "SS2B"],
      teachers: ["Dr. Robert Johnson", "Mrs. Patricia Adams"],
    },
    {
      id: 2,
      name: "English Language",
      code: "ENG",
      classes: ["JSS1A", "JSS1B", "JSS2A", "SS1A", "SS2B"],
      teachers: ["Mrs. Elizabeth Taylor"],
    },
    {
      id: 3,
      name: "Physics",
      code: "PHY",
      classes: ["SS1A", "SS2B"],
      teachers: ["Dr. Robert Johnson"],
    },
    {
      id: 4,
      name: "Chemistry",
      code: "CHEM",
      classes: ["SS1A", "SS2B"],
      teachers: ["Mr. Michael Brown"],
    },
    {
      id: 5,
      name: "Biology",
      code: "BIO",
      classes: ["SS1A", "SS2B"],
      teachers: ["Mr. Michael Brown"],
    },
    // Add more mock subjects as needed
  ]
}

const addSubjectApi = async (subjectData) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return the subject with an ID
  return {
    ...subjectData,
    id: Math.floor(Math.random() * 1000),
  }
}

// Async thunks
export const fetchSubjects = createAsyncThunk("subjects/fetchSubjects", async (_, { rejectWithValue }) => {
  try {
    const subjects = await fetchSubjectsApi()
    return subjects
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const addSubject = createAsyncThunk("subjects/addSubject", async (subjectData, { rejectWithValue }) => {
  try {
    const subject = await addSubjectApi(subjectData)
    return subject
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const initialState = {
  subjects: [],
  loading: false,
  error: null,
}

const subjectsSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch subjects cases
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false
        state.subjects = action.payload
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch subjects"
      })
      // Add subject cases
      .addCase(addSubject.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addSubject.fulfilled, (state, action) => {
        state.loading = false
        state.subjects.push(action.payload)
      })
      .addCase(addSubject.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to add subject"
      })
  },
})

export const { clearError } = subjectsSlice.actions

export default subjectsSlice.reducer
