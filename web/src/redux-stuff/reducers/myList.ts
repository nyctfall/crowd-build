import { createSlice, PayloadAction } from "@reduxjs/toolkit"

/**
 * The default Redux Adapter store PC part list ID used for myList.
 */
export const myListStoreAdapterDefaultID: string = ""

const initialState = {
  id: myListStoreAdapterDefaultID
}

export const myListSlice = createSlice({
  name: "myList",
  initialState: initialState,
  reducers: {
    /**
     * Set the list cache ID for myList to the list ID to be used as myList.
     */
    setMyListId(state, { payload }: PayloadAction<string>) {
      state.id = payload
    },
    /**
     * Resets the list cache ID for myList back to the default of: "0".
     */
    resetMyListId(state) {
      state.id = myListStoreAdapterDefaultID
    }
  }
})

// Action creators are generated for each case reducer function
export const { setMyListId, resetMyListId } = myListSlice.actions

export default myListSlice.reducer
