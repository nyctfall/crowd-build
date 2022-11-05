import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { SessionUser } from "../../../types/api"


export interface SessionState {
  isLoggedIn: boolean
  user: undefined | SessionUser
  token: string | undefined
}

const initialState: SessionState = {
  isLoggedIn: false,
  user: undefined,
  token: undefined
}

export const sessionStateSlice = createSlice({
  name: "searchState",
  initialState: initialState,
  reducers: {
    sessionLogin: (state, { payload }: PayloadAction<SessionUser>) => {
      state.isLoggedIn = true
      state.user = payload
    },
    sessionLogout: (state) => {
      state.isLoggedIn = false
      state.user = undefined
      state.token = undefined 
    },
    sessionUpdateUser: (state, { payload }: PayloadAction<SessionUser>) => {
      state.user = payload
    },
    sessionSetToken: (state, { payload }: PayloadAction<string>) => {
      state.token = payload
    },
    sessionUnsetToken: (state) => {
      state.token = undefined 
    },
  },
})

// Action creators are generated for each case reducer function
export const { sessionLogin, sessionLogout, sessionUpdateUser, sessionSetToken, sessionUnsetToken } = sessionStateSlice.actions

export default sessionStateSlice.reducer