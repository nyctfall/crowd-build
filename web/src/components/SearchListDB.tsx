import { useEffect, useState } from "react"
import { Button, ButtonGroup, Container, Form, Spinner } from "react-bootstrap"
import { skipToken } from "@reduxjs/toolkit/dist/query"
import { dbgLog } from "~types/logger"
import { useAppSelector } from "../redux-stuff/hooks"
import { useGetListsQuery } from "../redux-stuff/query"
import DeleteListButton from "./DeleteListButton"
import EditListButton from "./EditListButton"
import CopyListButton from "./CopyListButton"
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
  onGetList?: (listQuery: ReturnType<typeof useGetListsQuery>) => any
}) {
  const Log = log.stackLogger("SearchListDB")

  const user = useAppSelector(state => state.session.user)

  // search list state:
  const [listInputId, setListInputId] = useState("")
  const [listSearchId, setListSearchId] = useState("")

  // get list from store cache or database:
  const listQuery = useGetListsQuery(listSearchId ? { id: listSearchId } : skipToken)
  const { isSuccess, isError, isFetching, data } = listQuery

  useEffect(() => {
    // prettier-ignore
    Log.stackLoggerInc("useEffect(,[listQuery])")(
      "onGetList", onGetList,
      "listInputId", listInputId,
      "listSearchId", listSearchId,
      "listQuery", listQuery,
      "user", user
    )

    // parent handler:
    onGetList?.(listQuery)
  }, [listQuery])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const log = Log.stackLoggerInc("handleSubmit")

    // prettier-ignore
    log(
      "listInputId", listInputId,
      "listSearchId", listSearchId,
      "listQuery", listQuery,
      "user", user,
      "e", e
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
        {isFetching ? (
          <Spinner animation="border" />
        ) : isError ? (
          "Sorry... can't find list with that id... :("
        ) : isSuccess && data ? (
          data instanceof Array ? (
            data.map(({ _id: id, user: owner }, i) => (
              <>
                <PCPartId key={i} partId={id} noToggle={true} />
                <ButtonGroup>
                  <CopyListButton listId={id} />
                  {owner ? (
                    user?._id === owner ? (
                      <EditListButton listId={id} owned={true} />
                    ) : (
                      ""
                    )
                  ) : (
                    <EditListButton listId={id} owned={false} />
                  )}
                  {owner ? (
                    user?._id === owner ? (
                      <DeleteListButton listId={id} owned={true} />
                    ) : (
                      ""
                    )
                  ) : (
                    <DeleteListButton listId={id} owned={false} />
                  )}
                </ButtonGroup>
              </>
            ))
          ) : (
            <>
              <PCPartListId listId={data._id} noToggle={true} />

              <ButtonGroup>
                <CopyListButton listId={data._id} />
                {data.user ? (
                  user?._id === data.user ? (
                    <EditListButton listId={data._id} owned={true} />
                  ) : (
                    ""
                  )
                ) : (
                  <EditListButton listId={data._id} owned={false} />
                )}
                {data.user ? (
                  user?._id === data.user ? (
                    <DeleteListButton listId={user._id} owned={true} />
                  ) : (
                    ""
                  )
                ) : (
                  <DeleteListButton listId={data._id} owned={false} />
                )}
              </ButtonGroup>
            </>
          )
        ) : (
          ""
        )}
      </Container>
    </>
  )
}
