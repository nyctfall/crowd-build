import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { storageAvailable, dbgLog, SessionUser } from "~types/api"

export interface SessionState {
  isLoggedIn: boolean
  user: undefined | SessionUser
  token: string | undefined
}

// debugging logger:
const log = dbgLog.fileLogger("session.ts")

/**
 * Boolean for if window.sessionStorage can be used.
 */
const sessionSavable = storageAvailable("sessionStorage")

/**
 * Boolean for if window.localStorage can be used.
 */
const localSavable = storageAvailable("localStorage")

/**
 * Previously saved login credentials, if available.
 */
let savedLogin: SessionState | null | undefined

// check if previous login credentials are available:
if (sessionSavable) savedLogin = JSON.parse(window.sessionStorage.getItem("login") ?? "null")
else if (localSavable) savedLogin = JSON.parse(window.localStorage.getItem("login") ?? "null")

// prettier-ignore
log("(global scope)",
  "sessionSaveable", sessionSavable,
  "localSaveable", localSavable
)

const initialState: SessionState = savedLogin ?? {
  isLoggedIn: false,
  user: undefined,
  token: undefined
}

/**
 * Redux Slice for login session credentials.
 */
export const sessionStateSlice = createSlice({
  name: "session",
  initialState: initialState,
  reducers: {
    /**
     * Redux Action to set login user in Redux store slice.
     */
    sessionLogin: (state, { payload: { user, token } }: PayloadAction<Required<Omit<SessionState, "isLoggedIn">>>) => {
      const Log = log.stackLogger("sessionLogin")

      state.isLoggedIn = true
      state.user = user
      state.token = token

      // prettier-ignore
      Log(
        "state", state,
        "user", user,
        "token", token,
        "sessionSavable", sessionSavable
      )

      // save to session:
      if (sessionSavable && token && user) {
        Log("window.sessionStorage.getItem('login')", window.sessionStorage.getItem("login"))

        window.sessionStorage.setItem(
          "login",
          JSON.stringify({
            isLoggedIn: true,
            user,
            token
          } as SessionState)
        )
      }
    },
    /**
     * Redux Action to delete session credentials in Redux store slice.
     */
    sessionLogout: state => {
      // delete session:
      window.sessionStorage.removeItem("login")

      state.isLoggedIn = false
      state.user = undefined
      state.token = undefined
    },
    /**
     * Redux Action to update login user in Redux store slice.
     */
    sessionUpdateUser: (state, { payload }: PayloadAction<SessionUser>) => {
      const Log = log.stackLogger("sessionUpdateUser")

      // prettier-ignore
      Log(
        "state", state,
        "payload", payload,
        "sessionSavable", sessionSavable
      )

      // save to session:
      if (sessionSavable && payload) {
        Log("window.sessionStorage.getItem('login')", window.sessionStorage.getItem("login"))

        window.sessionStorage.setItem(
          "login",
          JSON.stringify({
            isLoggedIn: true,
            user: payload,
            token: state.token
          } as SessionState)
        )
      }

      state.user = payload
    },
    /**
     * Redux Action to set login token in Redux store slice.
     */
    sessionSetToken: (state, { payload }: PayloadAction<string>) => {
      const Log = log.stackLogger("sessionSetToken")

      // prettier-ignore
      Log(
        "state", state,
        "payload", payload,
        "sessionSavable", sessionSavable
      )

      // save to session:
      if (sessionSavable && payload) {
        Log("window.sessionStorage.getItem('login')", window.sessionStorage.getItem("login"))

        window.sessionStorage.setItem(
          "login",
          JSON.stringify({
            isLoggedIn: true,
            user: state.user,
            token: payload
          } as SessionState)
        )
      }

      state.token = payload
    },
    /**
     * Redux Action to delete login token from Redux store slice.
     */
    sessionUnsetToken: state => {
      state.token = undefined
    }
  }
})

// Action creators are generated for each case reducer function
export const { sessionLogin, sessionLogout, sessionUpdateUser, sessionSetToken, sessionUnsetToken } =
  sessionStateSlice.actions

/**
 * Redux Reducer for login session credentials Redux store slice.
 */
export default sessionStateSlice.reducer
