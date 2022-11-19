import { useEffect, useMemo } from "react"
import { Button, Spinner } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { usePatchListMutation } from "../redux-stuff/query"
import { updateList } from "../redux-stuff/reducers/allLists"
import { dbgLog, ModifyResponce, PCPartInfo, SessionType } from "../../types/api"


/** 
 * Overwrite current myList to unowned lists or lists owned by user.
 * 
 * Cannot edit lists owned by other users.
 * 
 * @param {string} props.id The database id of the list to edit.
 */
export default function EditListButton({ id }: { id: string }){
  const dispatch = useAppDispatch()

  const { myList, allLists, session, api } = useAppSelector(state => state)

  
  // the PC part ids from myList to overwrite the target list with:
  const parts = (Object.values(myList.entities)
  .filter(part => part != undefined) as PCPartInfo[])
  .map(({ _id }) => _id)
  
  
  // no-op if target list and myList have all the same parts,
  // useMemo to only recomput on change and for performance in large lists:
  const isIdentical = useMemo(
    () => parts.length === allLists.entities[id]?.parts.length && parts.every(partId => allLists.entities[id]?.parts.includes(partId)), 
    [myList, allLists.entities[id]]
  )


  /** @todo track if myList or target lists was changed since last edit: */

  
  
  // setup patch request:
  const editListMut = usePatchListMutation()
  const [trigger, mutRes] = editListMut
  const { isSuccess, isLoading, isUninitialized, isError, data } = mutRes


  // update UI on successful edit:
  useEffect(() => {
    dbgLog("EditListButton.tsx", ["EditListButton","useEffect(,[data])"], "session", session, "myList", myList, "mutRes", mutRes, "editListMut", editListMut)
    
    if ((data as SessionType)?.success || (data as ModifyResponce)?.modifiedCount){
      // update list in cache:
      dispatch(updateList({ id: id, changes: { parts } }))
    }
  }, [data])


  const handleClick = () => {
    dbgLog("EditListButton.tsx", ["EditListButton","handleClick"], "session", session, "myList", myList, "mutRes", mutRes, "editListMut", editListMut)

    // update list in database with parts in myList:
    trigger({ 
      id, 
      token: session.token, 
      parts
    })
  }


  // 
  const variant = isError ? "outline-secondary" : isIdentical ? "outline-warning" : "warning"


  return (
    <>
      <Button 
        variant={variant} 
        disabled={parts.length < 1 || isIdentical}
        active={isLoading}
        onClick={handleClick}
      >
        {isLoading ? 
            <Spinner variant={variant.includes("warning") ? "dark" : variant.replace("outline-", "")} animation="border" />
          : isError ? 
            "Failed To Edit List..."
            : !isUninitialized && !((data as SessionType)?.success || (data as ModifyResponce)?.modifiedCount) ?
              "Cannot Edit List"
              : parts.length < 1 ?
                "Must Have PC Parts In My List"
                : isIdentical ?
                  /** @todo track if myList or target lists was changed since last edit: */
                  // isSuccess ?
                  //   "Edited"  
                    /* : */ "Same As My List"
                  : "Edit List"
        }
      </Button>
    </>
  )
}