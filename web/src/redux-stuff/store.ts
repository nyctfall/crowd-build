import { configureStore } from "@reduxjs/toolkit"
import { rtkQueryAPISlice } from "./query"
import partsDB from "./reducers/partsDB"
import myList from "./reducers/myList"
import allLists from "./reducers/allLists"
import partSearchParams from "./reducers/search-params"
import searchState from "./reducers/search-state"
import session from "./reducers/session"


export const store = configureStore({
  reducer: {
    partsDB,
    myList,
    allLists,
    partSearchParams,
    searchState,
    session,
    [rtkQueryAPISlice.reducerPath]: rtkQueryAPISlice.reducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(rtkQueryAPISlice.middleware)
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch