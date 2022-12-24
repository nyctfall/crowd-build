import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type Big from "big.js"
import {
  idFilterBuilder,
  oemFilterBuilder,
  PCPartSearchParamsState,
  PCPartSearchURI,
  PCPartType,
  typeFilterBuilder
} from "~types/api"

const initialState: PCPartSearchParamsState = {
  ids: [],
  types: [],
  oems: []
}

/**
 * Coerces to correct type, set here once to be more optimised.
 */
const priceChecker = new PCPartSearchURI()

/**
 * Redux Slice for PC parts database search query parameters.
 */
export const partSearchParamsSlice = createSlice({
  name: "partSearchParams",
  initialState: initialState,
  reducers: {
    /**
     *
     */
    addFilterID(state, { payload: newID }: PayloadAction<string>) {
      state.ids = idFilterBuilder({ initArray: [newID, ...state.ids] }).array
    },
    /**
     *
     */
    addFilterIDs(state, { payload: newIDs }: PayloadAction<string[]>) {
      state.ids = idFilterBuilder({ initArray: state.ids.concat(newIDs) }).array
    },
    /**
     *
     */
    removeFilterIDByValue(state, { payload: id }: PayloadAction<string>) {
      const indexOfID = state.ids.indexOf(id)
      if (indexOfID >= 0) state.ids.splice(indexOfID, 1)
    },
    /**
     *
     */
    removeFilterIDByIndex(state, { payload: index }: PayloadAction<number>) {
      state.ids.splice(index, 1)
    },
    /**
     *
     */
    setFilterID(state, { payload: [index, newID] }: PayloadAction<[index: number, newID: string]>) {
      const newIDs = idFilterBuilder({ initArray: [newID, ...state.ids] })
      newIDs.set(index, newID)
      state.ids = newIDs.array
    },
    /**
     *
     */
    setAllFilterIDs(state, { payload: ids }: PayloadAction<string[]>) {
      state.ids = idFilterBuilder({ initArray: ids }).array
    },
    /**
     *
     */
    removeAllFilterIDs(state) {
      state.ids.splice(0)
    },
    /**
     *
     */
    addFilterOEM(state, { payload: newOEM }: PayloadAction<string>) {
      state.oems = oemFilterBuilder({ initArray: [newOEM, ...state.oems] }).array
    },
    /**
     *
     */
    addFilterOEMs(state, { payload: newOEMs }: PayloadAction<string[]>) {
      state.oems = oemFilterBuilder({ initArray: state.oems.concat(newOEMs) }).array
    },
    /**
     *
     */
    removeFilterOEMByValue(state, { payload: oem }: PayloadAction<string>) {
      const indexOfOEM = state.oems.indexOf(oem)
      if (indexOfOEM >= 0) state.oems.splice(indexOfOEM, 1)
    },
    /**
     *
     */
    removeFilterOEMByIndex(state, { payload: index }: PayloadAction<number>) {
      state.oems.splice(index, 1)
    },
    /**
     *
     */
    setFilterOEM(state, { payload: [index, newOEM] }: PayloadAction<[index: number, newOEM: string]>) {
      const newOEMs = oemFilterBuilder({ initArray: [newOEM, ...state.oems] })
      newOEMs.set(index, newOEM)
      state.oems = newOEMs.array
    },
    /**
     *
     */
    setAllFilterOEMs(state, { payload: oems }: PayloadAction<string[]>) {
      state.oems = oemFilterBuilder({ initArray: oems }).array
    },
    /**
     *
     */
    removeAllFilterOEMs(state) {
      state.oems.splice(0)
    },
    /**
     *
     */
    addFilterType(state, { payload: newType }: PayloadAction<PCPartType>) {
      state.types = typeFilterBuilder({ initArray: [newType, ...state.types] }).array
    },
    /**
     *
     */
    addFilterTypes(state, { payload: newTypes }: PayloadAction<PCPartType[]>) {
      state.types = typeFilterBuilder({ initArray: state.types.concat(newTypes) }).array
    },
    /**
     *
     */
    removeFilterTypeByValue(state, { payload: type }: PayloadAction<PCPartType>) {
      const indexOfType = state.oems.indexOf(type)
      if (indexOfType >= 0) state.oems.splice(indexOfType, 1)
    },
    /**
     *
     */
    removeFilterTypeByIndex(state, { payload: index }: PayloadAction<number>) {
      state.types.splice(index, 1)
    },
    /**
     *
     */
    setFilterType(state, { payload: [index, newType] }: PayloadAction<[index: number, newType: PCPartType]>) {
      const newTypes = typeFilterBuilder({ initArray: [newType, ...state.types] })
      newTypes.set(index, newType)
      state.types = newTypes.array
    },
    /**
     *
     */
    setAllFilterTypes(state, { payload: types }: PayloadAction<PCPartType[]>) {
      state.types = typeFilterBuilder({ initArray: types }).array
    },
    /**
     *
     */
    removeAllFilterTypes(state) {
      state.types.splice(0)
    },
    /**
     *
     */
    setMinMSRPs: (state, { payload: minPrice }: PayloadAction<PCPartSearchURI["minPriceFilter"] | string>) => {
      // string is internally coerced to Big:
      priceChecker.minPriceFilter = minPrice

      // if price is undefined, or coerced sucessfully:
      if (
        priceChecker.minPriceFilter === minPrice ||
        priceChecker.minPriceFilter?.eq?.(minPrice as Exclude<PCPartSearchURI["minPriceFilter"], undefined>)
      )
        state.minPrice = priceChecker.minPriceFilter
    },
    /**
     *
     */
    unsetMinMSRP: state => {
      state.minPrice = undefined
    },
    /**
     *
     */
    setMaxMSRPs: (state, { payload: maxPrice }: PayloadAction<PCPartSearchURI["maxPriceFilter"] | string>) => {
      // string is internally coerced to Big:
      priceChecker.maxPriceFilter = maxPrice

      // if price is undefined, or coerced sucessfully:
      if (
        priceChecker.maxPriceFilter === maxPrice ||
        priceChecker.maxPriceFilter?.eq?.(maxPrice as Exclude<PCPartSearchURI["maxPriceFilter"], undefined>)
      )
        state.maxPrice = priceChecker.maxPriceFilter
    },
    /**
     *
     */
    unsetMaxMSRP: state => {
      state.maxPrice = undefined
    }
  }
})

// Action creators are generated for each case reducer function:
export const {
  addFilterID,
  addFilterIDs,
  setFilterID,
  setAllFilterIDs,
  removeFilterIDByIndex,
  removeFilterIDByValue,
  removeAllFilterIDs,
  addFilterOEM,
  addFilterOEMs,
  setFilterOEM,
  setAllFilterOEMs,
  removeFilterOEMByIndex,
  removeFilterOEMByValue,
  removeAllFilterOEMs,
  addFilterType,
  addFilterTypes,
  setFilterType,
  setAllFilterTypes,
  removeFilterTypeByIndex,
  removeFilterTypeByValue,
  removeAllFilterTypes,
  setMinMSRPs,
  unsetMinMSRP,
  setMaxMSRPs,
  unsetMaxMSRP
} = partSearchParamsSlice.actions

export default partSearchParamsSlice.reducer
