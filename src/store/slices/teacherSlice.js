import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Simulated API calls
const fetchTeachersApi = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return mock data
  return [
    {
      id: 1,
      name: "Dr. Robert Johnson",
      email: "robert.j@molek.edu",
      subjects: ["Mathematics", "Physics"],
      classes: ["SS1A", "SS2B"],
      status: "active",
    },
    {
      id: 2,
      name: "Mrs. Elizabeth Taylor",
      email: "elizabeth.t@molek.edu",
      subjects: ["English", "Literature"],
      classes: ["JSS3A", "SS1B"],
      status: "active",
    },
    {
      id: 3,
      name: "Mr. Michael Brown",
      email: "michael.b@molek.edu",
      subjects: ["Chemistry", "Biology"],
      classes: ["SS2A", "SS3B"],
      status: "pending",
    },
    // Add more mock teachers as needed
  ]
}

// Async thunks
export const fetchTeachers = createAsyncThunk("teachers/fetchTeachers", async (_, { rejectWithValue }) => {
  try {
    const teachers = await fetchTeachersApi()
    return teachers
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const approveTeacher = createAsyncThunk("teachers/approveTeacher", async (teacherId, { rejectWithValue }) => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, this would update the teacher's status in the database
    return teacherId
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

export const rejectTeacher = createAsyncThunk("teachers/rejectTeacher", async (teacherId, { rejectWithValue }) => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, this would delete or update the teacher's status in the database
    return teacherId
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const initialState = {
  teachers: [],
  loading: false,
  error: null,
}

const teachersSlice = createSlice({
  name: "teachers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch teachers cases
      .addCase(fetchTeachers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTeachers.fulfilled, (state, action) => {
        state.loading = false
        state.teachers = action.payload
      })
      .addCase(fetchTeachers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to fetch teachers"
      })
      // Approve teacher cases
      .addCase(approveTeacher.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(approveTeacher.fulfilled, (state, action) => {
        state.loading = false
        const teacherIndex = state.teachers.findIndex((teacher) => teacher.id === action.payload)
        if (teacherIndex !== -1) {
          state.teachers[teacherIndex].status = "active"
        }
      })
      .addCase(approveTeacher.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to approve teacher"
      })
      // Reject teacher cases
      .addCase(rejectTeacher.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(rejectTeacher.fulfilled, (state, action) => {
        state.loading = false
        state.teachers = state.teachers.filter((teacher) => teacher.id !== action.payload)
      })
      .addCase(rejectTeacher.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || "Failed to reject teacher"
      })
  },
})

export const { clearError } = teachersSlice.actions

export default teachersSlice.reducer
