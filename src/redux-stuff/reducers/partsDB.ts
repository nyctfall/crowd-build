import { createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import type { PCPartInfo } from "../../../types/api"


const partsDBAdapter = createEntityAdapter<PCPartInfo>({
  selectId: part => part._id
})

export const partsDBSlice = createSlice({
  name: "partsDB",
  initialState: partsDBAdapter.getInitialState(/* initListState */),
  reducers: {
    addPart: partsDBAdapter.addOne,
    addManyParts: partsDBAdapter.addMany,
    removePart: partsDBAdapter.removeOne,
    removeManyParts: partsDBAdapter.removeMany,
    removeAllParts: partsDBAdapter.removeAll,
    setPart: partsDBAdapter.setOne,
    setManyParts: partsDBAdapter.setMany,
    setAllParts: partsDBAdapter.setAll,
    updatePart: partsDBAdapter.updateOne,
    updateManyParts: partsDBAdapter.updateMany,
    upsertPart: partsDBAdapter.upsertOne,
    upsertManyParts: partsDBAdapter.upsertMany
  },
})

// Action creators are generated for each case reducer function
export const { addPart, addManyParts, removePart, removeManyParts, removeAllParts, setPart, setManyParts, setAllParts, updatePart, updateManyParts, upsertPart, upsertManyParts } = partsDBSlice.actions

export { partsDBAdapter }

export default partsDBSlice.reducer