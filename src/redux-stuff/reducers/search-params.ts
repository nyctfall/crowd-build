import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { PCPartSearchParamsState, PCPartSearchURI, PCPartType } from "../../../types/api"


const initialState: PCPartSearchParamsState = {
  ids: [],
  types: [],
  oems: []
}

export const partSearchParamsSlice = createSlice({
  name: "partSearchParams",
  initialState: initialState,
  reducers: {
    addFilterID(state, { payload: newID }: PayloadAction<string>){
      state.ids = new PCPartSearchURI({ ids: [newID, ...state.ids] }).filterIDs.array
    },
    addFilterIDs(state, { payload: newIDs }: PayloadAction<string[]>){
      state.ids = new PCPartSearchURI({ ids: state.ids.concat(newIDs) }).filterIDs.array
    },
    removeFilterIDByValue(state, { payload: id }: PayloadAction<string>){
      const indexOfID = state.ids.indexOf(id)
      if (indexOfID >= 0) state.ids.splice(indexOfID, 1)
    },
    removeFilterIDByIndex(state, { payload: index }: PayloadAction<number>){
      state.ids.splice(index, 1)
    },
    setFilterID(state, { payload: [ index, newID ] }: PayloadAction<[index: number, newID: string]>){
      const newIDs = new PCPartSearchURI({ ids: [newID, ...state.ids] }).filterIDs
      newIDs.set(index, newID)
      state.ids = newIDs.array
    },
    setAllFilterIDs(state, { payload: ids }: PayloadAction<string[]>){
      state.ids = new PCPartSearchURI({ ids }).filterIDs.array
    },
    removeAllFilterIDs(state){
      state.ids.splice(0)
    },

    addFilterOEM(state, { payload: newOEM }: PayloadAction<string>){
      state.oems = new PCPartSearchURI({ oems: [newOEM, ...state.oems] }).filterOEMs.array
    },
    addFilterOEMs(state, { payload: newOEMs }: PayloadAction<string[]>){
      state.oems = new PCPartSearchURI({ oems: state.oems.concat(newOEMs) }).filterOEMs.array
    },
    removeFilterOEMByValue(state, { payload: oem }: PayloadAction<string>){
      const indexOfOEM = state.oems.indexOf(oem)
      if (indexOfOEM >= 0) state.oems.splice(indexOfOEM, 1)
    },
    removeFilterOEMByIndex(state, { payload: index }: PayloadAction<number>){
      state.oems.splice(index, 1)
    },
    setFilterOEM(state, { payload: [ index, newOEM ] }: PayloadAction<[index: number, newOEM: string]>){
      const newOEMs = new PCPartSearchURI({ oems: [newOEM, ...state.oems] }).filterOEMs
      newOEMs.set(index, newOEM)
      state.oems = newOEMs.array
    },
    setAllFilterOEMs(state, { payload: oems }: PayloadAction<string[]>){
      state.oems = new PCPartSearchURI({ oems }).filterOEMs.array
    },
    removeAllFilterOEMs(state){
      state.oems.splice(0)
    },
    
    addFilterType(state, { payload: newType }: PayloadAction<string>){
      state.types = new PCPartSearchURI({ types: [newType, ...state.types] }).filterTypes.array
    },
    addFilterTypes(state, { payload: newTypes }: PayloadAction<PCPartType[]>){
      state.types = new PCPartSearchURI({ types: state.types.concat(newTypes) }).filterTypes.array
    },
    removeFilterTypeByValue(state, { payload: type }: PayloadAction<string>){
      const indexOfType = state.oems.indexOf(type)
      if (indexOfType >= 0) state.oems.splice(indexOfType, 1)
    },
    removeFilterTypeByIndex(state, { payload: index }: PayloadAction<number>){
      state.types.splice(index, 1)
    },
    setFilterType(state, { payload: [ index, newType ] }: PayloadAction<[index: number, newType: PCPartType]>){
      const newTypes = new PCPartSearchURI({ types: [newType, ...state.types] }).filterTypes
      newTypes.set(index, newType)
      state.types = newTypes.array
    },
    setAllFilterTypes(state, { payload: types }: PayloadAction<PCPartType[]>){
      state.types = new PCPartSearchURI({ types }).filterTypes.array
    },
    removeAllFilterTypes(state){
      state.types.splice(0)
    },

    setMinMSRPs: (state, { payload: minPrice }: PayloadAction<PCPartSearchURI["minPriceFilter"] | string>) => {
      // string is coerced internally to Big:
      state.minPrice = new PCPartSearchURI({ minPrice }).minPriceFilter
    },
    unsetMinMSRP: (state) => {
      state.minPrice = undefined
    },

    setMaxMSRPs: (state, { payload: maxPrice }: PayloadAction<PCPartSearchURI["maxPriceFilter"] | string>) => {
      // string is coerced internally to Big:
      state.maxPrice = new PCPartSearchURI({ maxPrice }).maxPriceFilter
    },
    unsetMaxMSRP: (state) => {
      state.maxPrice = undefined
    },
  },
})

// Action creators are generated for each case reducer function
export const { 
  addFilterID, addFilterIDs, setFilterID, setAllFilterIDs, removeFilterIDByIndex, removeFilterIDByValue, removeAllFilterIDs,
  addFilterOEM, addFilterOEMs, setFilterOEM, setAllFilterOEMs, removeFilterOEMByIndex, removeFilterOEMByValue, removeAllFilterOEMs,
  addFilterType, addFilterTypes, setFilterType, setAllFilterTypes, removeFilterTypeByIndex, removeFilterTypeByValue, removeAllFilterTypes,
  setMinMSRPs, unsetMinMSRP,
  setMaxMSRPs, unsetMaxMSRP
} = partSearchParamsSlice.actions

export default partSearchParamsSlice.reducer