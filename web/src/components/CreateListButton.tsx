import { useState, useEffect } from "react"
import { Button, Container, Placeholder, Spinner } from "react-bootstrap"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { usePostListMutation } from "../redux-stuff/query"
import { addList } from "../redux-stuff/reducers/allLists"
import { dbgLog, PCPartInfo } from "~types/api"


/**
 * Create a list on the database by saving it with RTK Query.
 * 
 * Defaults to saving as public list.
 * 
 * @todo once list is saved, allow editing uusing RTK Query cache to get saved myList _id to edit on db.
 * @todo track is list is in db use rtkq invalidate cache tag for created list to allow resave if deleted.
 * @param {boolean} props.disown Will save as a public list, instead of as a list owned by signed-in user.
 * @param {boolean} props.onClick Called on button click with onClick event.
 */
export default function CreateListButton({ disown, onClick }: { disown?: boolean, onClick?: Function }){
  const dispatch = useAppDispatch()

  const { myList, session, api } = useAppSelector(state => state)


  // myList parts as part id array:
  const myListParts = (Object.values(myList.entities)
  .filter(part => part != undefined) as PCPartInfo[])
  .map(part => part._id)


  // button click state:
  const [save, setSave] = useState(false)
  
  // myList part ids at time of button click:
  const [listParts, setListToSave] = useState<string[]>([])
  
  // if there are myList contents, save list to database:
  const [trigger, saveListMut] = usePostListMutation()
  
  const { isSuccess, isUninitialized, isLoading, isError, data } = saveListMut
  
  
  // save database List info to cache, and reset state:
  useEffect(() => {
    dbgLog("CreateListButton.tsx", ["CreateListButton","useEffect(,[save, data])"], "save", save, "listParts", listParts, "data", data, "saveListQuery", saveListMut, "myListParts", myListParts, "myList", myList, "session", session, "api", api)
    
    if (save && data){
      // cache newly saved database list info to store:
      dispatch(addList(data))
      
      // list successfully saved:
      setSave(false)
      setListIsSaved(true)
    }
  }, [save, data])


  // myList changed since last save:
  const [listSaved, setListIsSaved] = useState(false)
  
  // check if myList was changed since last save:
  useEffect(() => {
    dbgLog("CreateListButton.tsx", ["CreateListButton","useEffect(,[myListParts, listParts])"], "listSaved", listSaved, "listParts", listParts, "myListParts", myListParts, "myList", myList, "data", data, "api", api)
    
    // check if myList has no contents, list wasn't saved, or lists are not equivanlent:
    if (myListParts.length > 0 && listParts.length > 0 && myListParts.length === listParts.length && myListParts.every(id => listParts.includes(id))){
      // myList was saved:
      setListIsSaved(true)
    }
    else {
      // myList was changed since being saved:
      setListIsSaved(false)
    }
  }, [myListParts, listParts])
      
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    dbgLog("CreateListButton.tsx", ["CreateListButton","handleClick"], "listSaved", listSaved, "listParts", listParts, "myListParts", myListParts, "myList", myList, "data", data, "api", api)
    
    // set to current myList part ids:
    setListToSave(myListParts)

    // call parent onClick handler:
    if (onClick) onClick(e)

    if (!listSaved && myListParts.length > 0) trigger({ 
      parts: myListParts, 
      token: session.token && !disown ? session.token : undefined 
    })
  }


  // 
  const variant = isLoading ? "outline-success" : isError ? "danger" : listSaved ? "outline-success" : "success"

  
  return (
    <>
      <Button 
        variant={variant}
        disabled={myListParts.length < 1 || listSaved}
        active={isLoading}
        onClick={handleClick}
      >
        {isLoading ? 
            <Spinner 
              variant={variant.replace("outline-", "")} 
              animation="border"
            />
          : isError ? 
            "Failed To Save..."
            : listSaved ?
              "Saved"
              : "Save List"
        }
      </Button>
      
      <Container fluid className="m-5 mw-100 w-50 mx-auto">
        {data ? <>
            <h4>Saved List ID: {data?._id}</h4>

            <h5>DEBUG:</h5>
            
            <pre className="text-start">
              {JSON.stringify(data, undefined, "  ")}
            </pre>
          </>
          : isLoading ? 
            <h4>Saved List ID: <Placeholder animation="wave" style={{ height:"2em" }} className="w-100" /></h4>
            : <Placeholder animation="wave" style={{ height:"2em" }} className="w-100" />
        }

      </Container>
    </>
  )
}