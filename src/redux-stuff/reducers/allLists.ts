import { createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import type { List } from "../../../types/api"


const allListsAdapter = createEntityAdapter<List>({
  selectId: list => list._id
})

export const allListsSlice = createSlice({
  name: "allLists",
  initialState: allListsAdapter.getInitialState(),
  reducers: {
    addList: allListsAdapter.addOne,
    addManyLists: allListsAdapter.addMany,
    removeList: allListsAdapter.removeOne,
    removeManyLists: allListsAdapter.removeMany,
    removeAllLists: allListsAdapter.removeAll,
    setList: allListsAdapter.setOne,
    setManyLists: allListsAdapter.setMany,
    setAllLists: allListsAdapter.setAll,
    updateList: allListsAdapter.updateOne,
    updateManyLists: allListsAdapter.updateMany,
    upsertList: allListsAdapter.upsertOne,
    upsertManyLists: allListsAdapter.upsertMany
  },
})

// Action creators are generated for each case reducer function
export const { addList, addManyLists, removeList, removeManyLists, removeAllLists, setList, setManyLists, setAllLists, updateList, updateManyLists, upsertList, upsertManyLists } = allListsSlice.actions

export { allListsAdapter }

export default allListsSlice.reducer