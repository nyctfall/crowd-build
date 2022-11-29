import { useState, useEffect } from "react"
import { Button, Spinner } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { setAllMyListParts } from "../redux-stuff/reducers/myList"
import useCacheList from "../hooks/useCacheList"
import { dbgLog, PCPartInfo } from "~types/api"


/**
 * Add all parts on target list to myList.
 * 
 * @param {string} props.id The database or entity id of the list to use.
 */
export default function CopyListButton({ id }: { id: string }){
  const dispatch = useAppDispatch()

  const { myList, partsDB, allLists } = useAppSelector(state => state)

  
  // myList as array of part ids:
  const list = (Object.values(myList.entities)
  .filter(part => part != undefined) as PCPartInfo[])
  .map(({ _id }) => _id)
  
  // no-op if target list and myList have all the same parts:
  const isIdentical = list.length === allLists.entities[id]?.parts.length && list.every(partId => allLists.entities[id]?.parts.includes(partId))

  // control copying state:
  const [copyList, setCopyList] = useState(false)
  
  // get list from id, should be from cache or fetch from database:
  const listCache = useCacheList(id, { skip: copyList, populate: true })

  const { 
    data: targetList, 
    rtkQuery: { isError: isErrorList }, 
    populated: { data: targetParts, rtkQuery: { isError: isErrorParts } } 
  } = listCache

  
  // replace myList with target list:
  useEffect(() => {
    dbgLog("CopyListButton.tsx", ["CopyListButton","useEffect(,[copyList, targetParts])"], "copyList", copyList, "targetParts", targetParts, "listCache", listCache, "myList", myList, "allLists", allLists, "partsDB", partsDB)
    
    if (copyList && targetParts){
      // get target list by id, then add all of it's parts to overwrite myList:
      dispatch(setAllMyListParts(targetParts))
      
      // disable copying of un-targeted list's parts to my list:
      setCopyList(false)
    }
  }, [copyList, /* targetParts */])
  
  
  const handleClick = () => {
    dbgLog("CopyListButton.tsx", ["CopyListButton","handleClick"], "copyList", copyList, "targetParts", targetParts, "listCache", listCache, "myList", myList, "allLists", allLists, "partsDB", partsDB)

    // enable copying of all target list's parts to overwrite myList:
    setCopyList(true)
  }


  return (
    <>
      <Button 
        variant={isIdentical ? "outline-secondary" : "info"} 
        disabled={isIdentical}
        onClick={handleClick}
      >
        {copyList && !targetList && !targetParts ? <>
            Loading...<Spinner animation="border" />
          </>
          : (isErrorList || isErrorParts) && !targetParts ?
            "Error Copying List"
            : isIdentical ? 
              "Same As My List"
              : "Copy To My List"
        }
      </Button>
    </>
  )
}