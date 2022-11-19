import { useState, useEffect } from "react"
import { Button, Container, Form, Spinner } from "react-bootstrap"
import { useAppSelector } from "../redux-stuff/hooks"
import DeleteListButton from "./DeleteListButton"
import EditListButton from "./EditListButton"
import CopyListButton from "./CopyListButton"
import useCacheList from "../hooks/useCacheList"
import PCPartId from "./PCPartId"
import PCPartListId from "./PCPartLIstId"
import { dbgLog } from "../../types/api"


/**
 * Search form to display list of searched PC part lists from store cache or backend database.
 */
export default function SearchListDB(){
  const { session } = useAppSelector(state => state)


  // search cache for list:
  const [searching, setSearching] = useState(false)
  const [searched, setSearched] = useState(false)

  
  // search list state:
  const [listInputId, setListInputId] = useState("")
  const [listSearchId, setListSearchId] = useState("")


  // get list from store cache or database:
  const listCache = useCacheList(listSearchId)
  const { data, rtkQuery } = listCache
  const { isError, isFetching } = rtkQuery


  useEffect(() => {
   dbgLog("SearchListDB.tsx", ["SearchListDB","useEffect(,[data])"], "data", data, "session", session, "listCache", listCache)
    
    // reset searching:
    if (data) setSearching(false)
  }, [data])
  
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    dbgLog("SearchListDB.tsx", ["SearchListDB","handleSubmit"], "data", data, "session", session, "listCache", listCache)
    
    e.preventDefault()
    
    // set searching for list:
    setSearching(true)
    setSearched(true)

    // set id to search for
    setListSearchId(listInputId)
  }
  

  return (
    <>
      <Form onSubmit={handleSubmit} className="w-50 mx-auto m-3 text-start">
        <Form.Group className="m-3">
          <Form.Label>
            <h4 className="d-inline-block">Search List by ID:</h4>
          </Form.Label>

          <Form.Control 
            required
            type="text" 
            name="id" 
            className="my-3" 
            placeholder="List ID (eg.: 635dc7e0ed486e5e5b91f41f)" 
            onChange={e => setListInputId(e.target.value)} 
          />

          <Button type="submit">Search</Button>
        </Form.Group>
      </Form>

      <Container fluid className="w-75">
        {data ? 
          data instanceof Array ?
            data.map(({ _id: id, user }, i) => <>
              <PCPartId key={i} id={id} />
              <CopyListButton id={id} />
              {!user || session.user?._id === user ? <EditListButton id={id} /> : ""}
              {!user || session.user?._id === user ? <DeleteListButton id={id} /> : ""}
            </>)
            : <>
              <PCPartListId listId={data._id} />
              <CopyListButton id={data._id} />
              {!data.user || session.user?._id === data.user ? <EditListButton id={data._id} /> : ""}
              {!data.user || session.user?._id === data.user ? <DeleteListButton id={data._id} /> : ""}
            </>
          : (searching && !isError) || isFetching ? <>
              <Spinner animation="border" /> 
            </>
            : searched ?
              "Sorry... can't find list with that id... :("
              : ""
        }
      </Container>
    </>
  )
}