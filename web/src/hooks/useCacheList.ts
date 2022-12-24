import { useState, useEffect } from "react"
import { skipToken } from "@reduxjs/toolkit/dist/query"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { useGetListsQuery } from "../redux-stuff/query"
import { addManyLists, addOneList } from "../redux-stuff/reducers/listsCache"
import useCacheParts from "./useCacheParts"
import { dbgLog } from "~types/logger"

// debugging logger:
const log = dbgLog.fileLogger("useCacheList.ts")

/**
 * Use Redux entities store as cache, or RTK Query cache, or RTK Query to fetch from database.
 *
 * @param {string | ""} id Database and entity id of the list. Empty string will cause a no-op.
 * @param {boolean} options.skip Will NOT fetch anything from database if true.
 * @param {boolean} options.reCache Will re-fetch from database if true.
 * @param {boolean} options.populate Will fetch list's parts from database if true.
 */
export default function useCacheList(
  id: string | "",
  {
    skip,
    reCache,
    populate
  }: { populate?: boolean } & ({ skip?: boolean; reCache?: never } | { skip?: never; reCache?: boolean }) = {}
) {
  const Log = log.stackLogger("useCacheList")

  const dispatch = useAppDispatch()

  // get store cache of all lists:
  const { listsCache, partsCache } = useAppSelector(state => state)

  // always get list from store cache:
  const list = id ? listsCache.entities[id] : undefined

  // query to get data if not in store cache:
  const query = useGetListsQuery(!skip && !list && id ? { id } : skipToken)

  const { data, refetch } = query

  // get parts of list:
  const populated = useCacheParts(list && list.parts && list.parts.length > 1 ? list.parts : [], {
    skip: skip || !populate || !list?.parts || list.parts.length < 1
  })

  // if store cache miss, add query data from RTK Query cache or database responce to store cache:
  useEffect(() => {
    // prettier-ignore
    Log.stackLoggerInc("useEffect(,[data])")(
      "preCached", preCached,
      "list", list,
      "query", query,
      "partsDB", partsCache,
      "ref list === partsDB.entities[id]", list === partsCache.entities[id],
      "ref list === data", list === data
    )

    // add data found in RTK Query cache or database to store cache:
    if (data instanceof Array) dispatch(addManyLists(data))
    else if (data) dispatch(addOneList(data))
  }, [data])

  // RTK Query has it's own cache, which can become stale compared to store cache, so refetch if store cache is deleted or modified and out of date:
  if (!skip && reCache) refetch()

  // get initial value of cache state:
  const [preCached] = useState(!!list)

  // return data from cache, or res after insertion into cache:
  return {
    // didn't need to make query, already in store:
    preCached,
    populated,
    data: list,
    rtkQuery: query
  }
}
