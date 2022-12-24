import { useState } from "react"
import type { EntityState } from "@reduxjs/toolkit"
import type { SubscriptionOptions } from "@reduxjs/toolkit/dist/query/core/apiState"
import { dbgLog } from "~types/logger"
import type { PCPartInfo } from "~types/api"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { useLazyGetPartsQuery } from "../redux-stuff/query"
import { addManyParts } from "../redux-stuff/reducers/partsCache"

// debugging logger:
const log = dbgLog.fileLogger("useLazyCacheParts.ts")

const fetchCache = (ids: string[], cache: EntityState<PCPartInfo>) =>
  // check if ids are set and if all parts are already in store cache:
  ids.length > 0 && ids.every(id => cache.ids.includes(id))
    ? // convert part ids to parts:
      (ids.map(id => cache.entities[id]) as PCPartInfo[])
    : undefined

/**
 * Use Redux entities store as cache, or RTK Query cache, or RTK Query to fetch from database.
 */
export default function useLazyCacheParts(opts?: SubscriptionOptions) {
  const Log = log.stackLogger("useLazyCacheParts")

  const dispatch = useAppDispatch()

  // get store cache of parts:
  const partsCache = useAppSelector(state => state.partsCache)

  // PC part IDs to find the corresponding parts:
  const [partIds, setPartIds] = useState<string[]>([])

  // get part info from store cache:
  const partsInfo = fetchCache(partIds, partsCache)

  // initial cache miss status, true if initally in store:
  const [cacheHit, setCacheHit] = useState(!!partsInfo)

  // lazy query to get missing data if not in store cache:
  const [trigger, partsQuery] = useLazyGetPartsQuery(opts)

  /**
   * Use RTK Query cache, or RTK Query to fetch from database.
   *
   * @param {string[]} ids Database and entity id array of the PC parts.
   * @param {boolean | undefined} preferCacheValue Will use RTK Query cache value if true, defaults to false.
   *
   * Triggers a lazy query.
   *
   * By default, this will start a new request even if there is already a value in the RTK Query cache. If you want to use the cache value and only start a request if there is no cache value, set the second argument to true.
   *
   * @remarks If you need to access the error or success payload immediately after a lazy query, you can chain `.unwrap()`.
   */
  const customTrigger = async (ids: string[], preferCacheValue?: boolean | undefined) => {
    const log = Log.stackLoggerInc("customTrigger")

    // prettier-ignore
    log(
      "ids", ids,
      "preferCacheValue", preferCacheValue,
      "opts", opts,
      "partsQuery", partsQuery,
      "partsCache", partsCache
    )

    // update hook's id state:
    setPartIds(ids)

    let error: undefined | typeof partsQuery.error

    let parts = fetchCache(ids, partsCache)

    log("cachedParts", parts)

    // check cache:
    if (parts) setCacheHit(true)
    else {
      try {
        const fetchedParts = await trigger(
          {
            ids: ids.filter(id => !partsCache.ids.includes(id)),
            oems: [],
            types: []
          },
          preferCacheValue
        ).unwrap()

        log("fetchedParts", fetchedParts)

        dispatch(addManyParts(fetchedParts))

        parts = fetchedParts
      } catch (e) {
        log.stackLoggerInc("catch").error("err", e)

        error = e as typeof partsQuery.error
      }
    }

    return { parts, error }
  }

  // return data from cache, or res after insertion into cache:
  return {
    trigger: customTrigger,
    cacheHit,
    data: partsInfo,
    rtkQuery: partsQuery
  }
}
