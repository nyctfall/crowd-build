import { createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import type { List } from "~types/api"
import { myListStoreAdapterDefaultID } from "./myList"

/**
 * Redux Adapter for PC part lists.
 */
const listsCacheAdapter = createEntityAdapter<List>({
  selectId: list => list._id
})

// init with default myList:
const initialState: ReturnType<typeof listsCacheAdapter.getInitialState> = {
  ids: [myListStoreAdapterDefaultID],
  entities: {
    [myListStoreAdapterDefaultID]: {
      _id: myListStoreAdapterDefaultID,
      parts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }
}

/**
 * Redux Slice for PC part lists.
 */
export const listsCacheSlice = createSlice({
  name: "listsCache",
  initialState: listsCacheAdapter.getInitialState(initialState),
  reducers: {
    /**
     * Redux Action to add a list to Redux store slice for PC part lists.
     */
    addOneList: listsCacheAdapter.addOne,
    /**
     * Redux Action to add many lists to Redux store slice for PC part lists.
     */
    addManyLists: listsCacheAdapter.addMany,
    /**
     * Redux Action to remove a list from Redux store slice for PC part lists.
     */
    removeOneList: listsCacheAdapter.removeOne,
    /**
     * Redux Action to remove many lists from Redux store slice for PC part lists.
     */
    removeManyLists: listsCacheAdapter.removeMany,
    /**
     * Redux Action to remove all lists from Redux store slice for PC part lists.
     */
    removeAllLists: listsCacheAdapter.removeAll,
    /**
     * Redux Action to change a list in Redux store slice for PC part lists.
     */
    setOneList: listsCacheAdapter.setOne,
    /**
     * Redux Action to change many lists in Redux store slice for PC part lists.
     */
    setManyLists: listsCacheAdapter.setMany,
    /**
     * Redux Action to change all lists in Redux store slice for PC part lists.
     */
    setAllLists: listsCacheAdapter.setAll,
    /**
     * Redux Action to update a list in Redux store slice for PC part lists.
     */
    updateOneList: listsCacheAdapter.updateOne,
    /**
     * Redux Action to update many lists in Redux store slice for PC part lists.
     */
    updateManyLists: listsCacheAdapter.updateMany,
    /**
     * Redux Action to update or add a list in Redux store slice for PC part lists.
     */
    upsertOneList: listsCacheAdapter.upsertOne,
    /**
     * Redux Action to update or add many list in Redux store slice for PC part lists.
     */
    upsertManyLists: listsCacheAdapter.upsertMany
  }
})

// Action creators are generated for each case reducer function:
export const {
  addOneList,
  addManyLists,
  removeOneList,
  removeManyLists,
  removeAllLists,
  setOneList,
  setManyLists,
  setAllLists,
  updateOneList,
  updateManyLists,
  upsertOneList,
  upsertManyLists
} = listsCacheSlice.actions

export { listsCacheAdapter }

/**
 * Redux Reducer for PC part list Redux store slice.
 */
export default listsCacheSlice.reducer
