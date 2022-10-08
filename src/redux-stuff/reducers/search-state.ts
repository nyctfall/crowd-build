import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface SearchState {
  hasSearched: boolean
  hasReSearched: boolean
}

const initialState: SearchState = {
  hasSearched: false,
  hasReSearched: false
}

export const searchStateSlice = createSlice({
  name: "searchState",
  initialState: initialState,
  reducers: {
    setSearched: (state, { payload }: PayloadAction<boolean>) => {
      state.hasSearched = payload
    },
    setReSearched: (state, { payload }: PayloadAction<boolean>) => {
      state.hasReSearched = payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setSearched, setReSearched } = searchStateSlice.actions

export default searchStateSlice.reducer