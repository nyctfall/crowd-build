import { useEffect } from "react"
import { Button, Spinner } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { useDeleteListMutation } from "../redux-stuff/query"
import { removeList } from "../redux-stuff/reducers/allLists"
import { dbgLog, DeleteResponce, SessionType } from "~types/api"


/** 
 * Delete unowned list or list owned by signed-in user.
 * 
 * Cannot delete lists owned by other users.
 * 
 * @param {string} props.id The database id of the list to delete.
 */
export default function DeleteListButton({ id }: { id: string }){
  const dispatch = useAppDispatch()

  const { session, api } = useAppSelector(state => state)

  
  // setup delete request:
  const deleteListMut = useDeleteListMutation()
  const [trigger, mutRes] = deleteListMut
  const { isLoading, isSuccess, isUninitialized, data, isError } = mutRes

  
  // remove cache list if deleted on database:
  useEffect(() => {
    dbgLog("DeleteListButton.tsx", ["DeleteListButton()","useEffect(,[data])"], "mutRes", mutRes, "deleteListMut", deleteListMut, "session", session)
    
    if ((data as SessionType)?.success || (data as DeleteResponce)?.deletedCount) {
      // delete list in store cache:
      dispatch(removeList(id))
    }
  }, [data])
  
  
  const handleClick = () => {
    dbgLog("DeleteListButton.tsx", ["DeleteListButton()","handleClick"], "mutRes", mutRes, "deleteListMut", deleteListMut, "session", session)

    // send delete list until database responce:
    trigger({ id, token: session.token })
  }


  // button should be greyed out when deletion is not possible:
  const variant = isError || isLoading ? "outline-danger" : !isUninitialized && !((data as SessionType)?.success || (data as DeleteResponce)?.deletedCount) ? "outline-secondary" : "danger"

  // buttons should be deactivated when deletion is not possible or already occured:
  const disabled = isSuccess || ((!isUninitialized || isError) && !((data as SessionType)?.success || (data as DeleteResponce)?.deletedCount))


  return (
    <>
      <Button 
        variant={variant} 
        active={isLoading}
        disabled={disabled}
        onClick={handleClick}
      >
        {isLoading ?
          <Spinner variant="danger" animation="border" />
          : isError ? 
            "Failed To Delete..."
            : isUninitialized ?
              "Delete List"
              : !((data as SessionType)?.success || (data as DeleteResponce)?.deletedCount) ?
                "Cannot Delete List"
                : "Deleted"
        }
      </Button>
    </>
  )
}