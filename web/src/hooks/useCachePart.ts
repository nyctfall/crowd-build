import { skipToken } from "@reduxjs/toolkit/dist/query"
import { useEffect, useState } from "react"
import { dbgLog } from "../../types/api"
import { useAppDispatch, useAppSelector } from "../redux-stuff/hooks"
import { useFetchPartsQuery } from "../redux-stuff/query"
import { addManyParts } from "../redux-stuff/reducers/partsDB"


/** 
 * Use Redux entities store as cache, or RTK Query cache, or RTK Query to fetch from database. 
 * 
 * @param {string | ""} id Database and entity id of the PC part. Empty string will caause a no-op.
 * @param {boolean} options.skip Will NOT fetch from database if true.
 * @param {boolean} options.reCache Will re-fetch from database if true.
 */
export default function useCachePart(id: string | "", { skip, reCache }: { skip?: boolean, reCache?: never } | { skip?: never, reCache?: boolean } = {}){
  const dispatch = useAppDispatch()

  // get store cache of all part info:
  const partsDB = useAppSelector(state => state.partsDB)
  
  // always get part info from store cache:
  const info = id ? partsDB.entities[id] : undefined


  // query to get data if not in store cache:
  const query = useFetchPartsQuery(!skip && !info && id ? { ids: [id], oems: [], types: [] } : skipToken)
  
  const { data, refetch } = query


  // if store cache miss, add query data from RTK Query cache or database responce to store cache:
  useEffect(() => {
    dbgLog("useCachePart.ts", ["useCachePart","useEffect(,[data`])"], "preCached", preCached, "info", info, "query", query, "partsDB", partsDB, "ref info === partsDB.entities[id]", info === partsDB.entities[id], "ref info === data", info === data)

    if (data){
      // add data found in RTK Query cache or database to store cache:
      dispatch(addManyParts(data))
    }
  }, [data])


  // RTK Query has it's own cache, which can become stale compared to store cache, so refetch if store cache is deleted or modified and out of date:
  if (!skip && reCache) refetch()

  // get initial value of cache state:
  const [preCached] = useState(!!info)
  
  // info was added, updated, or deleted from store cache: 
  /* 
  useEffect(() => {
    console.log(`${"-".repeat(10)}useCachePart.ts${"-".repeat(10)}\n`, "> useCachePart() > useEffect(,[info])\n", "preCached", preCached, "info", info, "query", query, "partsDB", partsDB, "ref info === partsDB.entities[id]", info === partsDB.entities[id], "ref info === data", info === data)
    
    // info was found in store cache initially, 
    // but the store cache entry has been modified or deleted:
    if (preCached){
      // store > found
      // mod/del store
      // store > found
      // rtk Mut
      // rtk tag > auto-refetch
    } else {
      // store ? not found
      // rtk Query fetch
      // rtk Query cache
      // rtk Query data > cache store
      // store > found
      // mod/del store
      // store > found
      // rtk Mut
      // rtk tag > auto-refetch
    }
  }, [info])
  */


  // return data from cache, or res after insertion into cache:
  return {
    // didn't need to make query, already in store:
    preCached,
    data: info,
    rtkQuery: query,
  }
}