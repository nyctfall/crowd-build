import { useEffect, useState } from "react"
import { Button, Container, Form, Spinner } from "react-bootstrap"
import { dbgLog } from "~types/logger"
import { useAppSelector } from "../redux-stuff/hooks"
import DeleteListButton from "./DeleteListButton"
import EditListButton from "./EditListButton"
import CopyListButton from "./CopyListButton"
import useCacheList from "../hooks/useCacheList"
import PCPartId from "./PCPartId"
import PCPartListId from "./PCPartLIstId"

// debugging logger:
const log = dbgLog.fileLogger("SearchListDB.tsx")

/**
 * Search form to display list of searched PC part lists from store cache or backend database.
 */
export default function SearchListDB({
  onGetList
}: {
  onGetList?: (listCache: ReturnType<typeof useCacheList>) => any
}) {
  const Log = log.stackLogger("SearchListDB")

  const { session } = useAppSelector(state => state)

  // search list state:
  const [listInputId, setListInputId] = useState("")
  const [listSearchId, setListSearchId] = useState("")

  // get list from store cache or database:
  const listCache = useCacheList(listSearchId)
  const { data, rtkQuery } = listCache
  const { isError, isFetching } = rtkQuery

  useEffect(() => {
    // prettier-ignore
    Log.stackLoggerInc("useEffect(,[listCache])")(
      "onGetList", onGetList,
      "listInputId", listInputId,
      "listSearchId", listSearchId,
      "listCache", listCache,
      "rtkQuery", rtkQuery,
      "session", session
    )

    // parent handler:
    onGetList?.(listCache)
  }, [listCache])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const log = Log.stackLoggerInc("handleSubmit")

    // prettier-ignore
    log(
      "listInputId", listInputId,
      "listSearchId", listSearchId,
      "listCache", listCache,
      "rtkQuery", rtkQuery,
      "session", session
    )

    e.preventDefault()

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
        {data ? (
          data instanceof Array ? (
            data.map(({ _id: id, user }, i) => (
              <>
                <PCPartId key={i} partId={id} noToggle={true} />
                <CopyListButton id={id} />
                {!user || session.user?._id === user ? <EditListButton id={id} /> : ""}
                {!user || session.user?._id === user ? <DeleteListButton id={id} /> : ""}
              </>
            ))
          ) : (
            <>
              <PCPartListId listId={data._id} noToggle={true} />
              <CopyListButton id={data._id} />
              {!data.user || session.user?._id === data.user ? <EditListButton id={data._id} /> : ""}
              {!data.user || session.user?._id === data.user ? <DeleteListButton id={data._id} /> : ""}
            </>
          )
        ) : isFetching ? (
          <Spinner animation="border" />
        ) : isError ? (
          "Sorry... can't find list with that id... :("
        ) : (
          ""
        )}
      </Container>
    </>
  )
}
