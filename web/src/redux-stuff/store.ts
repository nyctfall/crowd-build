import { configureStore } from "@reduxjs/toolkit"
import { rtkQueryAPISlice } from "./query"
import partsCache from "./reducers/partsCache"
import myListId from "./reducers/myList"
import listsCache from "./reducers/listsCache"
import partSearchParams from "./reducers/partSearchParams"
import searchState from "./reducers/search-state"
import session from "./reducers/session"

export const store = configureStore({
  reducer: {
    partsCache,
    myListId,
    listsCache,
    partSearchParams,
    searchState,
    session,
    [rtkQueryAPISlice.reducerPath]: rtkQueryAPISlice.reducer
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware().concat(rtkQueryAPISlice.middleware)
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
