import { configureStore } from "@reduxjs/toolkit"
import { partAPI } from "./query"
import partsDB from "./reducers/partsDB"
import myList from "./reducers/list"
import partSearchParams from "./reducers/search-params"
import searchState from "./reducers/search-state";

export const store = configureStore({
  reducer: {
    partsDB,
    myList,
    partSearchParams,
    searchState,
    [partAPI.reducerPath]: partAPI.reducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(partAPI.middleware)
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch