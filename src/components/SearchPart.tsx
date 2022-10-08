import React, { PropsWithChildren, useEffect, useState } from "react"
import { skipToken } from "@reduxjs/toolkit/query/react"
import { ButtonGroup, ButtonToolbar, Container, Dropdown, DropdownButton, ToggleButton, ToggleButtonGroup } from "react-bootstrap"
import "../styles/SearchPart.scss"
import { PCPartType } from "../../types/api"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { useFetchPartsQuery } from "../redux-stuff/query"
import { addManyParts } from "../redux-stuff/reducers/partsDB"
import { setAllFilterTypes } from "../redux-stuff/reducers/search-params"
import StatefulSeachButton from "./StatefulSearchButton"
import { setReSearched, setSearched } from "../redux-stuff/reducers/search-state"


export default function SearchPart(){
  // dispatch fetched data to store:
  const dispatch = useAppDispatch()
  
  // get search queryState from store
  const queryState = useAppSelector(state => state.partSearchParams)
  
  // get data from store: for DEBUG
  const res = useAppSelector(state => state.partsDB)
  
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
    if (data) {
      console.log("~!!!!!!!!!!!!!!!data!!!!!!!!!!!!!!!!~")
      console.log("res", res)
      console.log("data", data)
      console.log("~!!!!!!!!!!!!!!!data!!!!!!!!!!!!!!!!~")
      
      dispatch(addManyParts(data))
    }
    else { 
      console.log("!~~~~~~~~~~~~~~~else~~~~~~~~~~~~~~~~!")
      console.log("res", res)
      console.log("data", data)
      console.log("!~~~~~~~~~~~~~~~else~~~~~~~~~~~~~~~~!")
    }
  }, [data, res]) 

  console.log("queryState",queryState,"canSearch",canSearch,"isSearching",isSearching,"isLoading",isLoading,"data",data)
  
  // disable loading spinner:
  useEffect(() => {
    console.log(">","queryState",queryState,"canSearch",canSearch,"isSearching",isSearching,"isLoading",isLoading,"data",data)
    
    setSearching(isLoading)
  }, [isLoading, isSearching])

  
  // on click to search db with api:
  const handleToggle = (e: React.MouseEvent<HTMLButtonElement | HTMLElement, MouseEvent>, newPartType: PCPartType) => {
    // check same data is not being re-searched:
    if (queryState.types.includes(newPartType)) return
    
    console.log("toggle...", newPartType)
    console.log("toggle...", queryState.types)
    console.log(e, e.target, (e.target as any).control, ((e.target as any).control as any).value)
    
    // select the type to be searched:
    dispatch(setAllFilterTypes([newPartType]))
    console.log("toggle...", queryState.types, queryState.types)

    // enable searching now a type has been selected:
    setCanSearch(true)

    // filters have been changed, so re-searching is needed:
    dispatch(setReSearched(false))
  }

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // don't search if no selected type:
    if (!canSearch) return
    
    console.log("searching...", queryState)
    console.log(e)

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
          as={ButtonGroup} 
          title={ queryState.types[0] ? `Type: ${queryState.types[0]}` : "Part Type"} 
          id="search-type-select" 
          variant={`${queryState.types[0] ? "" : "outline-" }secondary`}
        >
          {Object.values(PCPartType).map(type =>
            <Dropdown.Item 
              as={ToggleButton}
              name={type}
              id={`${type}-${Math.ceil(Math.random()*Number.MAX_SAFE_INTEGER)}`}
              key={type} 
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
          aria-label="SearchPCPartType" 
          name="SearchPCPartType" 
          type="radio" 
          style={{ flexWrap: "wrap" }}
          id="search-type-toolbar"
        >
          {Object.values(PCPartType).map(type =>
            <ToggleButton 
              id={`${type}-${Math.ceil(Math.random()*Number.MAX_SAFE_INTEGER)}`}
              key={type} 
              variant={`${queryState.types.includes(type) ? "" : "outline-"}secondary`} 
              value={type} 
              name={type} 
              onClick={e => handleToggle(e, type)}
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