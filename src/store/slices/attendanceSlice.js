import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import attendanceService from "../../api/attendanceService"

// Async thunks
export const fetchClassAttendance = createAsyncThunk(
  "attendance/fetchClassAttendance",
  async ({ classId, date }, { rejectWithValue }) => {
    try {
      return await attendanceService.getClassAttendance(classId, date)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const saveAttendance = createAsyncThunk(
  "attendance/saveAttendance",
  async (attendanceData, { rejectWithValue }) => {
    try {
      return await attendanceService.saveAttendance(attendanceData)
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const fetchClassAttendanceStats = createAsyncThunk(
  "attendance/fetchClassAttendanceStats",
  async ({ classId, termId, sessionId }, { rejectWithValue }) => {
    try {
      return await attendanceService.getClassAttendanceStats(classId, { termId, sessionId })
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const fetchStudentAttendance = createAsyncThunk(
  "attendance/fetchStudentAttendance",
  async ({ studentId, termId, sessionId }, { rejectWithValue }) => {
    try {
      return await attendanceService.getStudentAttendance(studentId, { termId, sessionId })
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export const fetchStudentAttendanceStats = createAsyncThunk(
  "attendance/fetchStudentAttendanceStats",
  async ({ studentId, termId, sessionId }, { rejectWithValue }) => {
    try {
      return await attendanceService.getStudentAttendanceStats(studentId, { termId, sessionId })
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

// Initial state
const initialState = {
  classAttendance: [],
  studentAttendance: [],
  classStats: null,
  studentStats: null,
  isLoading: false,
  error: null,
}

// Slice
const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    clearClassAttendance: (state) => {
      state.classAttendance = []
    },
    clearStudentAttendance: (state) => {
      state.studentAttendance = []
    },
    updateAttendanceRecord: (state, action) => {
      const { studentId, present } = action.payload
      const index = state.classAttendance.findIndex((record) => record.studentId === studentId)
      if (index !== -1) {
        state.classAttendance[index].present = present
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchClassAttendance
      .addCase(fetchClassAttendance.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchClassAttendance.fulfilled, (state, action) => {
        state.isLoading = false
        state.classAttendance = action.payload
      })
      .addCase(fetchClassAttendance.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // saveAttendance
      .addCase(saveAttendance.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(saveAttendance.fulfilled, (state, action) => {
        state.isLoading = false
        // Update attendance if needed
        if (action.payload.attendance) {
          state.classAttendance = action.payload.attendance
        }
      })
      .addCase(saveAttendance.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // fetchClassAttendanceStats
      .addCase(fetchClassAttendanceStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchClassAttendanceStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.classStats = action.payload
      })
      .addCase(fetchClassAttendanceStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // fetchStudentAttendance
      .addCase(fetchStudentAttendance.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStudentAttendance.fulfilled, (state, action) => {
        state.isLoading = false
        state.studentAttendance = action.payload
      })
      .addCase(fetchStudentAttendance.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // fetchStudentAttendanceStats
      .addCase(fetchStudentAttendanceStats.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStudentAttendanceStats.fulfilled, (state, action) => {
        state.isLoading = false
        state.studentStats = action.payload
      })
      .addCase(fetchStudentAttendanceStats.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearClassAttendance, clearStudentAttendance, updateAttendanceRecord } = attendanceSlice.actions

export default attendanceSlice.reducer
