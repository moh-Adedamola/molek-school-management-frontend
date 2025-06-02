import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Simulated API calls
const fetchClassesApi = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data
  return [
    {
      id: 1,
      name: "JSS1A",
      level: "JSS1",
      arm: "A",
      classTeacher: "Mrs. Johnson",
      students: 35,
    },
    {
      id: 2,
      name: "JSS1B",
      level: "JSS1",
      arm: "B",
      classTeacher: "Mr. Williams",
      students: 32,
    },
    {
      id: 3,
      name: "JSS2A",
      level: "JSS2",
      arm: "A",
      classTeacher: "Ms. Davis",
      students: 30,
    },
    {
      id: 4,
      name: "SS1A",
      level: "SS1",
      arm: "A",
      classTeacher: "Dr. Brown",
      students: 28,
    },
    {
      id: 5,
      name: "SS2B",
      level: "SS2",
      arm: "B",
      classTeacher: "Mr. Thompson",
      students: 25,
    },
    // Add more mock classes as needed
  ]
}

const addClass = async (classData) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return the class with an ID
  return {
    ...classData,
    id: Math.floor(Math.random() * 1000),
    students: 0, // New class has no students yet
  }
}

// Async thunks
export const fetchClasses = createAsyncThunk("classes/fetchClasses", async (_, { rejectWithValue }) => {
  try {
    const classes = await fetchClassesApi()
    return classes
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const createClass = createAsyncThunk("classes/createClass", async (classData, { rejectWithValue }) => {
  try {
    const newClass = await addClass(classData)
    return newClass
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const initialState = {
  classes: [],
  loading: false,
  error: null,
}

const classesSlice = createSlice({
  name: "classes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch classes cases
      .addCase(fetchClasses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchClasses.fulfilled, (state, action) => {
        state.loading = false
        state.classes = action.payload
      })
      .addCase(fetchClasses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch classes"
      })
      // Create class cases
      .addCase(createClass.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createClass.fulfilled, (state, action) => {
        state.loading = false
        state.classes.push(action.payload)
      })
      .addCase(createClass.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to create class"
      })
  },
})

export const { clearError } = classesSlice.actions

export default classesSlice.reducer
