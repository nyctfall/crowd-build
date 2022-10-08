import React, { useState } from "react"
import { filterDB, PCPartInfo } from "../../types/api"
import PCPartList from "../components/PCPartList"
import SearchPart from "../components/SearchPart"
import { useAppSelector } from "../redux-stuff/hooks"

let list: PCPartInfo[] = []
let filteredList: PCPartInfo[] = []

export default function Database(){
  const { hasSearched, hasReSearched } = useAppSelector(state => state.searchState)

  // state for the search filters from store:
  const params = useAppSelector(state => state.partSearchParams)
  // state for if there was a previous search, get data from store:
  const entities = useAppSelector(state => state.partsDB.entities)
  
  if (hasSearched){
    // results from previous db search:
    list = Object.values(entities) as PCPartInfo[]
    
    if (hasReSearched){ 
      // see if any results passed the filters:
      filteredList = filterDB(list, params)
    }
  }
  
  return (
    <>
      <h1>Database</h1>
      <SearchPart />
      {list.length > 0 ? 
        filteredList.length > 0 ?
          <PCPartList list={filteredList} />:
          <h2>Sorry, no results matched that search...</h2>: 
        <h2>Try searching for parts to add to your build!</h2>
      }
    </>
  )
}