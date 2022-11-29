import { useEffect, useState } from "react"
import { skipToken } from "@reduxjs/toolkit/query/react"
import { ButtonToolbar, Container, Dropdown, DropdownButton, ToggleButton, ToggleButtonGroup } from "react-bootstrap"
import { dbgLog, PCPartType } from "~types/api"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { useFetchPartsQuery } from "../redux-stuff/query"
import { addManyParts } from "../redux-stuff/reducers/partsDB"
import { setAllFilterTypes } from "../redux-stuff/reducers/search-params"
import StatefulSeachButton from "./StatefulSearchButton"
import { setReSearched, setSearched } from "../redux-stuff/reducers/search-state"


/**
 * Search for PC parts by type.
 */
export default function SearchPart(){
  const dispatch = useAppDispatch()
  
  // get search queryState from store
  // get data from store: for DEBUG
  const { partSearchParams: queryState, partsDB: res } = useAppSelector(state => state)
  
  
  // part type has been selected at all state:
  const [canSearch, setCanSearch] = useState(
    // check if search options were already selected:
    Object.values(queryState).reduce(
      // see if any options were defined:
      (b, v) => b || (!Array.isArray(v) || v.length > 0),
      // default to false:
      false
    )
  )
  
  // new part type selected state:
  const { hasSearched } = useAppSelector(store => store.searchState)
  
  // search state:
  const [isSearching, setSearching] = useState(false)
  
  // fetch parts API:
  const { data, isLoading } = useFetchPartsQuery(queryState ?? skipToken, { skip: !isSearching })
  
  
  // add the fetched parts to the store:
  useEffect(() => {
    dbgLog("SearchPart.tsx", ["SearchPart","useEffect(,[data, res])"], "res", res, "data", data)
    
    if (data) {
      dispatch(addManyParts(data))
    }
  }, [data, res])


  dbgLog("SearchPart.tsx", "SearchPart", "queryState", queryState, "canSearch", canSearch, "isSearching", isSearching, "isLoading", isLoading, "data", data)
  

  // disable loading spinner:
  useEffect(() => {
    dbgLog("SearchPart.tsx", ["SearchPart","useEffect(,[isLoading, isSearching])"], "queryState", queryState, "canSearch", canSearch, "isSearching", isSearching, "isLoading", isLoading, "data", data)
    
    setSearching(isLoading)
  }, [isLoading, isSearching])

  
  // on click to search db with api:
  const handleToggle = (e: React.MouseEvent<HTMLButtonElement | HTMLElement, MouseEvent> | React.ChangeEvent<HTMLInputElement>, newPartType: PCPartType) => {
    dbgLog("SearchPart.tsx", ["SearchPart","handleToggle"], "toggle... newPartType", newPartType, "toggle... queryState.types", queryState.types, "e", e)
    
    // check same data is not being re-searched:
    if (queryState.types.includes(newPartType)) return
    
    // select the type to be searched:
    dispatch(setAllFilterTypes([newPartType]))

    // enable searching now a type has been selected:
    setCanSearch(true)

    // filters have been changed, so re-searching is needed:
    dispatch(setReSearched(false))
  }


  const handleSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dbgLog("SearchPart.tsx", ["SearchPart","handleSearch"], "searching... queryState", queryState, "e", e)
    
    // don't search if no selected type:
    if (!canSearch) return

    // start search spinner:
    setSearching(true)

    // disable re-searching for the same data:
    setCanSearch(false)

    dispatch(setSearched(true))
    dispatch(setReSearched(true))
  }
  

  return (
    <Container fluid id="search-bar">
      <ButtonToolbar>
        {/* for small screens: dropdown */}
        <DropdownButton 
          title={queryState.types[0] ? `Type: ${queryState.types[0]}` : "Part Type"} 
          id="search-type-select" 
          variant={`${queryState.types[0] ? "" : "outline-" }secondary`}
        >
          {Object.values(PCPartType).map((type, i) =>
            <Dropdown.Item 
              key={i} 
              id={`${type}-${Math.ceil(Math.random()*Number.MAX_SAFE_INTEGER)}`}
              name={type} 
              variant={`${queryState.types.includes(type) ? "" : "outline-"}secondary`} 
              value={type} 
              onClick={e => handleToggle(e, type)}
            >
              {type}
            </Dropdown.Item>
          )}
        </DropdownButton>
        
        {/* for large screens: toolbar */}
        <ToggleButtonGroup 
          name="SearchPCPartType" 
          type="radio" 
          style={{ 
            flexWrap: "wrap"
          }}
          id="search-type-toolbar"
        >
          {Object.values(PCPartType).map((type, i) =>
            <ToggleButton 
              key={i} 
              id={`${type}-${Math.ceil(Math.random()*Number.MAX_SAFE_INTEGER)}`}
              variant={`${queryState.types.includes(type) ? "" : "outline-"}secondary`} 
              value={type} 
              name={type} 
              type="radio" 
              onChange={(e) => handleToggle(e, type)}
            >
              {type}
            </ToggleButton>
          )}
        </ToggleButtonGroup>

        <StatefulSeachButton {...{handleSearch,hasSearched,isSearching,canSearch}} />
      </ButtonToolbar>
    </Container>
  )
}