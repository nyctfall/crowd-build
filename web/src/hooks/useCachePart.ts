import { skipToken } from "@reduxjs/toolkit/dist/query"
import { useEffect, useState } from "react"
import { dbgLog } from "~types/logger"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { useGetPartsQuery } from "../redux-stuff/query"
import { addManyParts } from "../redux-stuff/reducers/partsCache"

// debugging logger:
const log = dbgLog.fileLogger("useCachePart.ts")

/**
 * Use Redux entities store as cache, or RTK Query cache, or RTK Query to fetch from database.
 *
 * @param {string | ""} id Database and entity id of the PC part. Empty string will caause a no-op.
 * @param {boolean} options.skip Will NOT fetch from database if true.
 * @param {boolean} options.reCache Will re-fetch from database if true.
 */
export default function useCachePart(
  id: string | "",
  { skip, reCache }: { skip?: boolean; reCache?: never } | { skip?: never; reCache?: boolean } = {}
) {
  const Log = log.stackLogger("useCachePart")

  const dispatch = useAppDispatch()

  // get store cache of all part info:
  const partsDB = useAppSelector(state => state.partsCache)

  // always get part info from store cache:
  const info = id ? partsDB.entities[id] : undefined

  // query to get data if not in store cache:
  const query = useGetPartsQuery(!skip && !info && id ? { ids: [id], oems: [], types: [] } : skipToken)

  const { data, refetch } = query

  // if store cache miss, add query data from RTK Query cache or database responce to store cache:
  useEffect(() => {
    // prettier-ignore
    Log.stackLoggerInc("useEffect(,[data`])")(
      "preCached", preCached,
      "info", info,
      "query", query,
      "partsDB", partsDB,
      "ref info === partsDB.entities[id]", info === partsDB.entities[id],
      "ref info === data", info === data
    )

    // add data found in RTK Query cache or database to store cache:
    if (data) dispatch(addManyParts(data))
  }, [data])

  // RTK Query has it's own cache, which can become stale compared to store cache, so refetch if store cache is deleted or modified and out of date:
  if (!skip && reCache) refetch()

  // get initial value of cache state:
  const [preCached] = useState(!!info)

  // return data from cache, or res after insertion into cache:
  return {
    // didn't need to make query, already in store:
    preCached,
    data: info,
    rtkQuery: query
  }
}
