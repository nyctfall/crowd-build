import { useState } from "react"
import type { EntityState } from "@reduxjs/toolkit"
import type { SubscriptionOptions } from "@reduxjs/toolkit/dist/query/core/apiState"
import { dbgLog } from "~types/logger"
import type { List } from "~types/api"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { useLazyGetListsQuery } from "../redux-stuff/query"
import { addManyLists, addOneList } from "../redux-stuff/reducers/listsCache"
import useLazyCacheParts from "./useLazyCacheParts"

// debugging logger:
const log = dbgLog.fileLogger("useLazyCacheList.ts")

const fetchCache = (id: string, cache: EntityState<List>) => (id ? cache.entities[id] : undefined)

/**
 * Use Redux entities store as cache, or RTK Query cache, or RTK Query to fetch from database.
 */
export default function useLazyCacheList(
  listOpts?: SubscriptionOptions | undefined,
  partsOpts?: SubscriptionOptions | undefined
) {
  const Log = log.stackLogger("useLazyCacheList")

  const dispatch = useAppDispatch()

  // get store cache of all lists:
  const listsCache = useAppSelector(state => state.listsCache)

  // PC part list ID to find the corresponding list:
  const [listId, setListId] = useState("")

  // always get list from store cache:
  const list = fetchCache(listId, listsCache)

  // initial cache miss status, true if initally in store:
  const [cacheHit, setCacheHit] = useState(!!list)

  // query to get list if not in store cache:
  const [trigger, listQuery] = useLazyGetListsQuery(listOpts)

  // get parts of list:
  const partsQuery = useLazyCacheParts(partsOpts)
  const { trigger: triggerParts } = partsQuery

  /**
   * Use RTK Query cache, or RTK Query to fetch from database.
   *
   * @param {string} props.id Database and entity id of the PC part list.
   * @param {boolean} props.populate Will fetch list's parts from database if true.
   * @param {boolean | undefined} preferCacheValue Will use RTK Query cache value if true, defaults to false.
   *
   * Triggers a lazy query.
   *
   * By default, this will start a new request even if there is already a value in the RTK Query cache. If you want to use the cache value and only start a request if there is no cache value, set the second argument to true.
   *
   * @remarks If you need to access the error or success payload immediately after a lazy query, you can chain `.unwrap()`.
   */
  const customTrigger = async (
    { id, populate }: { id: string; populate?: boolean },
    preferCacheValue?: boolean | undefined
  ) => {
    const log = Log.stackLoggerInc("customTrigger")

    // prettier-ignore
    log(
      "id", id,
      "populate", populate,
      "preferCacheValue", preferCacheValue,
      "listOpts", listOpts,
      "partsOpts", partsOpts,
      "listId", listId,
      "listQuery", listQuery,
      "partsQuery", partsQuery,
      "lists", listsCache
    )

    // update hook's id state:
    setListId(id)

    let error: undefined | typeof listQuery.error

    // list from cache:
    let list = fetchCache(id, listsCache)

    if (list) setCacheHit(true)
    // list from fetch:
    else {
      try {
        const fetchedList = await trigger({ id }, preferCacheValue).unwrap()

        log("fetchedList", fetchedList)

        // add fetched list to cache
        if (fetchedList instanceof Array) {
          // add to cache:
          dispatch(addManyLists(fetchedList))

          // set to fetched list:
          list = fetchedList[0]
        } else {
          // add to cache:
          dispatch(addOneList(fetchedList))

          // set to fetched list:
          list = fetchedList
        }
      } catch (e) {
        log.stackLoggerInc("catch")("err", e)

        error = e as typeof listQuery.error
      }
    }

    // populate parts
    if (!error && populate && list)
      return {
        list,
        error,
        populated: await triggerParts(list.parts, preferCacheValue)
      }

    return { list, error }
  }

  // return data from cache, or res after insertion into cache:
  return {
    trigger: customTrigger,
    populated: partsQuery,
    preCached: cacheHit,
    data: list,
    rtkQuery: listQuery
  }
}
