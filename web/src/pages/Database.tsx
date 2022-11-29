import { useEffect, useState } from "react"
import PCPartList from "../components/PCPartList"
import SearchPart from "../components/SearchPart"
import { useAppSelector } from "../redux-stuff/hooks"
import { dbgLog, filterDB, PCPartInfo } from "~types/api"
import { LinkContainer } from "react-router-bootstrap"
import { Button } from "react-bootstrap"


/** @todo Refactor into react state: */ 
let list: PCPartInfo[] = []

/** @todo Refactor into react state: */ 
let filteredList: PCPartInfo[] = []


/**
 * Search PC part database for parts to add to My List.
 */
export default function Database(){
  // state for the search filters from store:
  // state for if there was a previous search, get data from store:
  const { partSearchParams: params, partsDB: { entities }, searchState: { hasReSearched, hasSearched }, myList } = useAppSelector(state => state)
  
  
  dbgLog("Databse.tsx", "Databse", "hasSearched", hasSearched, "hasReSearched", hasReSearched, "filteredList", filteredList, "list", list, "params", params, "entities", entities, "myList", myList)
  
  
  /** @todo Refactor into react state: */ 
  if (hasSearched){
    dbgLog("Databse.tsx", ["Databse","if(hasSearched)"], "hasSearched", hasSearched, "hasReSearched", hasReSearched, "filteredList", filteredList, "list", list, "params", params, "entities", entities, "myList", myList)
    
    // results from previous db search:
    list = Object.values(entities) as PCPartInfo[]
    
    if (hasReSearched){ 
      dbgLog("Databse.tsx", ["Databse","if(hasReSearched)"], "hasSearched", hasSearched, "hasReSearched", hasReSearched, "filteredList", filteredList, "list", list, "params", params, "entities", entities, "myList", myList)

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
          <PCPartList list={filteredList} />
          : <>
            <h2>Sorry, no results matched that search...</h2>
          </>
        : <>
          <h2>Try searching for parts to add to your build!</h2>
        </>
      }

      {myList.ids.length > 0 ?
        <LinkContainer to="/my-list" className="my-5">
          <Button variant="info">Go Back to My List</Button>
        </LinkContainer>
        : ""
      }
    </>
  )
}