import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { User } from "@/lib/types"
import { sampleUsers } from "@/data/sample-data"

interface UsersState {
  users: User[]
  selectedUser: User | null
  searchQuery: string
}

const initialState: UsersState = {
  users: sampleUsers,
  selectedUser: null,
  searchQuery: "",
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser(state, action: PayloadAction<User>) {
      state.users.push(action.payload)
    },
    removeUser(state, action: PayloadAction<string>) {
      const idx = state.users.findIndex((u) => u.id === action.payload)
      if (idx !== -1) {
        state.users[idx].isActive = false
      }
    },
    updateUser(state, action: PayloadAction<{ id: string; updates: Partial<User> }>) {
      const idx = state.users.findIndex((u) => u.id === action.payload.id)
      if (idx !== -1) {
        state.users[idx] = { ...state.users[idx], ...action.payload.updates }
      }
    },
    selectUser(state, action: PayloadAction<User | null>) {
      state.selectedUser = action.payload
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload
    },
  },
})

export const { addUser, removeUser, updateUser, selectUser, setSearchQuery } = usersSlice.actions
export default usersSlice.reducer
