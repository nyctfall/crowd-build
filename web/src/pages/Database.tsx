import { LinkContainer } from "react-router-bootstrap"
import { Button } from "react-bootstrap"
import { dbgLog } from "~types/logger"
import { useAppSelector } from "../redux-stuff/hooks"
import SearchPart from "../components/SearchPart"

// debugging logger:
const log = dbgLog.fileLogger("Database.tsx")

/**
 * Search PC part database for parts to add to My List.
 */
export default function Database() {
  // const Log = log.stackLogger("Database")

  const myListParts = useAppSelector(state => state.listsCache.entities[state.myListId.id]?.parts)

  return (
    <>
      <h1>Database</h1>

      <SearchPart />

      {myListParts?.length ? (
        <LinkContainer to="/my-list" className="my-5">
          <Button variant="info">Go Back to My List</Button>
        </LinkContainer>
      ) : (
        ""
      )}
    </>
  )
}
