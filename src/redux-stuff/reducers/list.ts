import { createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import type { PCPartInfo } from "../../../types/api"


const listAdapter = createEntityAdapter<PCPartInfo>()

export const listSlice = createSlice({
  name: "list",
  initialState: listAdapter.getInitialState(),
  reducers: {
    addListPart: listAdapter.addOne,
    addManyListParts: listAdapter.addMany,
    removeListPart: listAdapter.removeOne,
    removeManyListParts: listAdapter.removeMany,
    removeAllListParts: listAdapter.removeAll,
    setListPart: listAdapter.setOne,
    setManyListParts: listAdapter.setMany,
    setAllListParts: listAdapter.setAll,
    updateListPart: listAdapter.updateOne,
    updateManyListParts: listAdapter.updateMany,
    upsertListPart: listAdapter.upsertOne,
    upsertManyListParts: listAdapter.upsertMany
  },
})

// Action creators are generated for each case reducer function
export const { addListPart, addManyListParts, removeListPart, removeManyListParts, removeAllListParts, setListPart, setManyListParts, setAllListParts, updateListPart, updateManyListParts, upsertListPart, upsertManyListParts } = listSlice.actions

export { listAdapter }

export default listSlice.reducer