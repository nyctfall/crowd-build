import { createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import type { PCPartInfo } from "~types/api"

/**
 * Redux Adapter for PC parts database cache.
 */
const partsCacheAdapter = createEntityAdapter<PCPartInfo>({
  selectId: part => part._id
})

/**
 * Redux Slice for PC parts database cache.
 */
export const partsCacheSlice = createSlice({
  name: "partsCache",
  initialState: partsCacheAdapter.getInitialState(),
  reducers: {
    /**
     * Redux Action to add a PC part to the PC parts database cache Redux store slice.
     */
    addOnePart: partsCacheAdapter.addOne,
    /**
     * Redux Action to add many PC parts to the PC parts database cache Redux store slice.
     */
    addManyParts: partsCacheAdapter.addMany,
    /**
     * Redux Action to remove a PC part from the PC parts database cache Redux store slice.
     */
    removeOnePart: partsCacheAdapter.removeOne,
    /**
     * Redux Action to remove many PC parts from the PC parts database cache Redux store slice.
     */
    removeManyParts: partsCacheAdapter.removeMany,
    /**
     * Redux Action to remove all PC parts from the PC parts database cache Redux store slice.
     */
    removeAllParts: partsCacheAdapter.removeAll,
    /**
     * Redux Action to change a PC part in the PC parts database cache Redux store slice.
     */
    setOnePart: partsCacheAdapter.setOne,
    /**
     * Redux Action to change many PC parts in the PC parts database cache Redux store slice.
     */
    setManyParts: partsCacheAdapter.setMany,
    /**
     * Redux Action to change all PC parts in the PC parts database cache Redux store slice.
     */
    setAllParts: partsCacheAdapter.setAll,
    /**
     * Redux Action to update a PC part in the PC parts database cache Redux store slice.
     */
    updateOnePart: partsCacheAdapter.updateOne,
    /**
     * Redux Action to update many PC parts in the PC parts database cache Redux store slice.
     */
    updateManyParts: partsCacheAdapter.updateMany,
    /**
     * Redux Action to update or add a PC part in the PC parts database cache Redux store slice.
     */
    upsertOnePart: partsCacheAdapter.upsertOne,
    /**
     * Redux Action to update or add many PC parts in the PC parts database cache Redux store slice.
     */
    upsertManyParts: partsCacheAdapter.upsertMany
  }
})

// Action creators are generated for each case reducer function:
export const {
  addOnePart,
  addManyParts,
  removeOnePart,
  removeManyParts,
  removeAllParts,
  setOnePart,
  setManyParts,
  setAllParts,
  updateOnePart,
  updateManyParts,
  upsertOnePart,
  upsertManyParts
} = partsCacheSlice.actions

export { partsCacheAdapter }

/**
 * Redux Reducer for PC parts database cache Redux store slice.
 */
export default partsCacheSlice.reducer
