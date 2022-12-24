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

const fetchCache = (id: string | undefined, cache: EntityState<PCPartInfo>) => (id ? cache.entities[id] : undefined)

/**
 * Use Redux entities store as cache, or RTK Query cache, or RTK Query to fetch from database.
 */
export default function useLazyCachePart(opts?: SubscriptionOptions) {
  const Log = log.stackLogger("useLazyCacheParts")

  const dispatch = useAppDispatch()

  // get store cache of parts:
  const partsCache = useAppSelector(state => state.partsCache)

  // PC part IDs to find the corresponding parts:
  const [partId, setPartId] = useState<string>()

  // always get part info from store cache:
  const partInfo = fetchCache(partId, partsCache)

  // initial cache miss status, true if initally in store:
  const [cacheHit, setCacheHit] = useState(!!partInfo)

  // lazy query to get missing data if not in store cache:
  const [trigger, partQuery] = useLazyGetPartsQuery(opts)

  /**
   * Use RTK Query cache, or RTK Query to fetch from database.
   *
   * @param {string} id Database and entity id of the PC part.
   * @param {boolean | undefined} preferCacheValue Will use RTK Query cache value if true, defaults to false.
   *
   * Triggers a lazy query.
   *
   * By default, this will start a new request even if there is already a value in the RTK Query cache. If you want to use the cache value and only start a request if there is no cache value, set the second argument to true.
   *
   * @remarks If you need to access the error or success payload immediately after a lazy query, you can chain `.unwrap()`.
   */
  const customTrigger = async (id: string, preferCacheValue?: boolean | undefined) => {
    const log = Log.stackLoggerInc("customTrigger")

    // prettier-ignore
    log(
      "id", id,
      "preferCacheValue", preferCacheValue,
      "opts", opts,
      "partQuery", partQuery,
      "partsCache", partsCache
    )

    // update hook's id state:
    setPartId(id)

    let error: undefined | typeof partQuery.error

    // check cache:
    let part = fetchCache(id, partsCache)

    log("cachedPart", part)

    if (part) setCacheHit(true)
    else {
      try {
        const fetchedPart = await trigger(
          {
            ids: [id],
            oems: [],
            types: []
          },
          preferCacheValue
        ).unwrap()

        log("fetchedPart", fetchedPart)

        dispatch(addManyParts(fetchedPart))

        part = fetchedPart[0]
      } catch (e) {
        log.stackLoggerInc("catch").error("err", e)

        error = e as typeof partQuery.error
      }
    }

    return { part, error }
  }

  // return data from cache, or res after insertion into cache:
  return {
    trigger: customTrigger,
    cacheHit,
    data: partInfo,
    rtkQuery: partQuery
  }
}
