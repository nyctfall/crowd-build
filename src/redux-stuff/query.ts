import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { PCPartSearchURI } from "../../types/api"
import type { PCPartSearchParamsState, PCPartInfo } from "../../types/api"


export const partAPI = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1"
  }),
  endpoints(builder){
    return {
      fetchParts: builder.query<PCPartInfo[],PCPartSearchParamsState>({
        query(URIParamsState){
          const URIParams = new PCPartSearchURI(URIParamsState)
          console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
          console.log("> query.ts", URIParams, URIParams.toURI(),`?${URIParams.toString()}`)
          // For Content-Type: application/x-www-form-urlencoded, spaces are to be replaced by "+", so one may wish to follow a encodeURIComponent() replacement with an additional replacement of "%20" with "+".
          return `/parts?${encodeURIComponent(URIParams.toString())}`
        }
      })
    }
  }
})

export const { useFetchPartsQuery } = partAPI
