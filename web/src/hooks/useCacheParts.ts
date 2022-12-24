import { skipToken } from "@reduxjs/toolkit/dist/query"
import { useEffect, useState } from "react"
import { dbgLog, PCPartInfo } from "~types/api"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { useGetPartsQuery } from "../redux-stuff/query"
import { addManyParts } from "../redux-stuff/reducers/partsCache"

// debugging logger:
const log = dbgLog.fileLogger("useCacheParts.ts")

/**
 * Use Redux entities store as cache, or RTK Query cache, or RTK Query to fetch from database.
 *
 * @param {string[] | []} ids Database and entity id array of the PC parts. Empty array will cause a no-op.
 * @param {boolean} option.skip Will NOT fetch from database if true.
 * @param {boolean} option.reCache Will re-fetch from database if true.
 */
export default function useCacheParts(
  ids: string[] | [],
  { skip, reCache }: { skip?: boolean; reCache?: never } | { skip?: never; reCache?: boolean } = {}
) {
  const Log = log.stackLogger("useCacheParts")

  const dispatch = useAppDispatch()

  // get store cache of all part info:
  const partsCache = useAppSelector(state => state.partsCache)

  // always get part info from store cache:
  // check every part is cached, and then convert part ids to parts:
  const info =
    ids?.length > 0 && ids?.every(id => partsCache.ids.includes(id))
      ? (ids.map(id => partsCache.entities[id]).filter(id => id != undefined) as PCPartInfo[])
      : undefined

  // query to get missing data if not in store cache:
  const query = useGetPartsQuery(
    !skip && !info ? { ids: ids.filter(id => !partsCache.ids.includes(id)), oems: [], types: [] } : skipToken
  )
  const { data, refetch } = query

  // if store cache miss, add query data from RTK Query cache or database responce to store cache:
  useEffect(() => {
    // prettier-ignore
    Log.stackLoggerInc("useEffect(,[data])")(
      "preCached", preCached,
      "info", info,
      "query", query,
      "partsCache", partsCache,
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
