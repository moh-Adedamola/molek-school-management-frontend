import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Simulated API calls
const fetchStudentsApi = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data
  return [
    {
      id: 1,
      name: "John Doe",
      class: "JSS1A",
      gender: "Male",
      parentName: "Mr. & Mrs. Doe",
      parentEmail: "doe.parents@example.com",
      admissionNumber: "MOL001",
    },
    {
      id: 2,
      name: "Jane Smith",
      class: "JSS2B",
      gender: "Female",
      parentName: "Mr. & Mrs. Smith",
      parentEmail: "smith.parents@example.com",
      admissionNumber: "MOL002",
    },
    // Add more mock students as needed
  ]
}

const addStudentApi = async (studentData) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return the student with an ID
  return {
    ...studentData,
    id: Math.floor(Math.random() * 1000),
    admissionNumber: `MOL${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`,
  }
}

// Async thunks
export const fetchStudents = createAsyncThunk("students/fetchStudents", async (_, { rejectWithValue }) => {
  try {
    const students = await fetchStudentsApi()
    return students
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const addStudent = createAsyncThunk("students/addStudent", async (studentData, { rejectWithValue }) => {
  try {
    const student = await addStudentApi(studentData)
    return student
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const initialState = {
  students: [],
  loading: false,
  error: null,
}

const studentsSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch students cases
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false
        state.students = action.payload
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch students"
      })
      // Add student cases
      .addCase(addStudent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.loading = false
        state.students.push(action.payload)
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to add student"
      })
  },
})

export const { clearError } = studentsSlice.actions

export default studentsSlice.reducer
