import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/lib/types"
import * as api from "@/lib/appwrite/api"

interface AuthState {
  currentUser: User | null
  isAuthenticated: boolean
  loginError: string | null
  status: "idle" | "loading"
  /** True once the initial session-restore attempt has finished. */
  authChecked: boolean
}

const initialState: AuthState = {
  currentUser: null,
  isAuthenticated: false,
  loginError: null,
  status: "idle",
  authChecked: false,
}

export const login = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    return await api.login(email, password)
  } catch {
    // Generic message to avoid account enumeration.
    return rejectWithValue("Invalid email or password")
  }
})

export const signup = createAsyncThunk<
  User,
  api.SignupInput,
  { rejectValue: string }
>("auth/signup", async (input, { rejectWithValue }) => {
  try {
    return await api.signup(input)
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Failed to sign up")
  }
})

export const completeOAuth = createAsyncThunk<
  User | null,
  { userId: string; secret: string }
>("auth/completeOAuth", async ({ userId, secret }) => {
  try {
    return await api.completeOAuthLogin(userId, secret)
  } catch {
    return null
  }
})

export const restoreSession = createAsyncThunk<User | null>(
  "auth/restoreSession",
  async () => {
    try {
      return await api.getCurrentProfile()
    } catch {
      return null
    }
  },
)

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await api.logout()
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateProfile(state, action: PayloadAction<Partial<User>>) {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload }
      }
    },
    clearError(state) {
      state.loginError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading"
        state.loginError = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "idle"
        state.currentUser = action.payload
        state.isAuthenticated = true
        state.authChecked = true
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "idle"
        state.loginError = action.payload ?? "Invalid email or password"
        state.isAuthenticated = false
        state.currentUser = null
      })
      .addCase(signup.pending, (state) => {
        state.status = "loading"
        state.loginError = null
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = "idle"
        state.currentUser = action.payload
        state.isAuthenticated = true
        state.authChecked = true
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = "idle"
        state.loginError = action.payload ?? "Failed to sign up"
      })
      .addCase(completeOAuth.pending, (state) => {
        state.status = "loading"
      })
      .addCase(completeOAuth.fulfilled, (state, action) => {
        state.status = "idle"
        state.authChecked = true
        if (action.payload) {
          state.currentUser = action.payload
          state.isAuthenticated = true
        } else {
          state.loginError = "Google sign-in failed. Please try again."
        }
      })
      .addCase(completeOAuth.rejected, (state) => {
        state.status = "idle"
        state.authChecked = true
        state.loginError = "Google sign-in failed. Please try again."
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.authChecked = true
        if (action.payload) {
          state.currentUser = action.payload
          state.isAuthenticated = true
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        state.authChecked = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null
        state.isAuthenticated = false
        state.loginError = null
      })
  },
})

export const { updateProfile, clearError } = authSlice.actions
export default authSlice.reducer
