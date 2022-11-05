import { createEntityAdapter, createSlice } from "@reduxjs/toolkit"
import type { PCPartInfo } from "../../../types/api"


const myListAdapter = createEntityAdapter<PCPartInfo>({
  selectId: part => part._id
})

export const myListSlice = createSlice({
  name: "myList",
  initialState: myListAdapter.getInitialState(),
  reducers: {
    addMyListPart: myListAdapter.addOne,
    addManyMyListParts: myListAdapter.addMany,
    removeMyListPart: myListAdapter.removeOne,
    removeManyMyListParts: myListAdapter.removeMany,
    removeAllMyListParts: myListAdapter.removeAll,
    setMyListPart: myListAdapter.setOne,
    setManyMyListParts: myListAdapter.setMany,
    setAllMyListParts: myListAdapter.setAll,
    updateMyListPart: myListAdapter.updateOne,
    updateManyMyListParts: myListAdapter.updateMany,
    upsertMyListPart: myListAdapter.upsertOne,
    upsertManyMyListParts: myListAdapter.upsertMany
  },
})

// Action creators are generated for each case reducer function
export const { 
  addMyListPart, addManyMyListParts, 
  removeMyListPart, removeManyMyListParts, removeAllMyListParts, 
  setMyListPart, setManyMyListParts, setAllMyListParts, 
  updateMyListPart, updateManyMyListParts, 
  upsertMyListPart, upsertManyMyListParts 
} = myListSlice.actions

export { myListAdapter }

export default myListSlice.reducer