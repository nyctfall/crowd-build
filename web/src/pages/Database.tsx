import { useMemo, useState } from "react"
import { Button } from "react-bootstrap"
import { LinkContainer } from "react-router-bootstrap"
import { dbgLog, filterDB, PCPartInfo } from "~types/api"
import { useAppSelector } from "../redux-stuff/hooks"
import PCPartList from "../components/PCPartList"
import SearchPart from "../components/SearchPart"

// debugging logger:
const log = dbgLog.fileLogger("Database.tsx")

/**
 * Search PC part database for parts to add to My List.
 */
export default function Database() {
  const Log = log.stackLogger("Database")

  // state for the search filters from store, if there was a previous search get data from store:
  const {
    myListId: { id: myListId },
    listsCache
  } = useAppSelector(state => state)

  const myList = listsCache.entities[myListId]
  const myListParts = myList?.parts

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
