import { Button, ButtonGroup, Container } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { dbgLog } from "~types/logger"
import { useAppSelector } from "../redux-stuff/hooks"
import SearchListDB from "../components/SearchListDB"
import CreateListButton from "../components/CreateListButton"
import PCPartListId from "../components/PCPartLIstId"

// debugging logger:
const log = dbgLog.fileLogger("MyList.tsx")

/**
 * The main hub for most list operations, edit local myList, save local myList the database, search for database lists, use, edit, and delete lists from database.
 */
export default function MyList() {
  // const Log = log.stackLogger("MyList")

  const myListParts = useAppSelector(state => state.listsCache.entities[state.myListId.id]?.parts)
  const isLoggedIn = useAppSelector(state => state.session.isLoggedIn)

  return (
    <>
      <h1>My List</h1>

      <Container fluid className="my-5">
        <SearchListDB />
      </Container>

      {myListParts?.length ? (
        <>
          <PCPartListId partIds={myListParts} />

          <Container fluid className="mw-100 m-3 mx-auto">
            <ButtonGroup>
              {isLoggedIn ? <CreateListButton disown={true} /> : ""}
              <CreateListButton />
            </ButtonGroup>
          </Container>
        </>
      ) : (
        <>
          <h2>Try searching for parts to add to your build!</h2>
        </>
      )}

      <LinkContainer to="/database" className="m-5 mx-auto">
        {/** @todo convert to stateful button */}
        <Button variant={myListParts?.length ? "secondary" : "info"}>PC Part Database</Button>
      </LinkContainer>
    </>
  )
}
