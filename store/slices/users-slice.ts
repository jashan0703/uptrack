import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/lib/types"
import * as api from "@/lib/appwrite/api"

interface UsersState {
  users: User[]
  selectedUser: User | null
  searchQuery: string
  status: "idle" | "loading"
  error: string | null
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  searchQuery: "",
  status: "idle",
  error: null,
}

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  return api.listProfiles()
})

export const onboardUser = createAsyncThunk<
  User,
  api.OnboardInput,
  { rejectValue: string }
>("users/onboardUser", async (input, { rejectWithValue }) => {
  try {
    return await api.onboardUser(input)
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Failed to onboard user")
  }
})

export const deactivateUser = createAsyncThunk<
  User,
  string,
  { rejectValue: string }
>("users/deactivateUser", async (id, { rejectWithValue }) => {
  try {
    return await api.setUserActive(id, false)
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Failed to remove user")
  }
})

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    selectUser(state, action: PayloadAction<User | null>) {
      state.selectedUser = action.payload
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "idle"
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "idle"
        state.error = action.error.message ?? "Failed to load users"
      })
      .addCase(onboardUser.fulfilled, (state, action) => {
        state.users.push(action.payload)
      })
      .addCase(deactivateUser.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u.id === action.payload.id)
        if (idx !== -1) state.users[idx] = action.payload
      })
  },
})

export const { selectUser, setSearchQuery } = usersSlice.actions
export default usersSlice.reducer
