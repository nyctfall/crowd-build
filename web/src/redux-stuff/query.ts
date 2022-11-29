import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { dbgLog, PCPartSearchURI, SessionUser, PCPartSearchParamsState, PCPartInfo, DeleteListParams, EditListParams, FetchListParams, FetchSubsetParams, List, NewsStory, PatchUserParams, SaveListParams, SessionType, ModifyResponce, DeleteResponce, LoginOrSigninCredentials } from "~types/api"
import jwtDecode, { JwtPayload } from "jwt-decode"


export const rtkQueryAPISlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1"
  }),
  tagTypes: ["List", "Part", "User"],
  endpoints: (builder) => ({
    fetchNews: builder.query<NewsStory[], FetchSubsetParams>({
      query: ({ offset, limit }) => `/news?${new URLSearchParams({ offset: (offset as any), limit: (limit as any) })}`
    }),
    fetchParts: builder.query<PCPartInfo[], PCPartSearchParamsState>({
      providesTags: (result, _error, _queryArg) => 
        result instanceof Array ?
          result.map(({ _id: id }) => ({ type: "Part", id }))
          : ["Part"],
      query(URIParamsState){
        const URIParams = new PCPartSearchURI(URIParamsState)
        
        // For Content-Type: application/x-www-form-urlencoded, spaces are to be replaced by "+", so one may wish to follow a encodeURIComponent() replacement with an additional replacement of "%20" with "+".
        dbgLog("query.ts", ["createApi","endpoints","fetchParts","query"], "URIParams", URIParams, "URIParams.toURI()", URIParams.toURI(), "URIParams.toURIEncoded()", URIParams.toURIEncoded(), "'?'+URIParams.toString()", `?${URIParams.toString()}`)
        
        return `/parts?${URIParams.toString()}`
      }
    }),
    fetchLists: builder.query<List | List[], FetchListParams>({
      providesTags: (result, _error, _queryArg) => 
        result ? 
          result instanceof Array ? 
            result.map(({ _id: id }) => ({ type: "List" as "List", id }))
            : [{ type: "List", id: result._id }] 
              : ["List"],
      query({ token, id, offset, limit }){
        let params = new URLSearchParams()
        if (typeof offset === "number") params.append("offset", offset.toString())
        if (typeof limit === "number") params.append("limit", limit.toString())
        let queryParams = params.toString()

        const query = queryParams ? `?${queryParams}` : ""

        if (token) {
          // get one user's list by id:
          if (id) return {
            method: "GET",
            url: `/profile/lists/id/${id}`,
            headers: new Headers([["Authorization", `Bearer ${token}`]])
          }
          // get user's lists:
          else return {
            method: "GET",
            url: `/profile/lists${query}`,
            headers: new Headers([["Authorization", `Bearer ${token}`]])
          }
        }
        else {
          // get list by id:
          if (id) return `/lists/id/${id}`
          // get all lists:
          else return `/lists${query}`
        }
      }
    }),
    fetchUser: builder.query<SessionUser, SessionUser["_id"]>({
      providesTags: (result, _error, _queryArg) => 
        result ? 
          result instanceof Array ? 
            result.map(({ _id: id }) => ({ type: "User", id }))
            : [{ type: "User", id: result._id }] 
              : ["User"],
      query: id => `/users/id/${id}`
    }),
    postLogin: builder.query<SessionType, LoginOrSigninCredentials>({
      providesTags: ["User"],
      /** @todo Expire at JWT expiration time, accounting for refresh tokens. */
      keepUnusedDataFor: Infinity, 
      query({ username, password, createUser }){
        if (createUser) return {
          method: "POST",
          url: "/signup",
          body: {
            username,
            password
          }
        }
        else return {
          method: "POST",
          url: "/login",
          body: {
            username,
            password
          }
        }
      },
      /** @todo Expire at JWT expiration time, accounting for refresh tokens. */
      async onCacheEntryAdded(queryArg, { dispatch, getState, extra, requestId, cacheEntryRemoved, cacheDataLoaded, getCacheEntry, updateCachedData }){
        /** @todo Expire at JWT expiration time, accounting for refresh tokens. */
        try {
          // get token from successful login:
          const { data, error } = getCacheEntry()
          

          dbgLog("query.ts", ["createApi","endpoints","postLogin","onCacheEntryAdded"], "queryArg", queryArg, "data", data, "error", error, "data.token", data?.token)
  

          // check successful login:
          if (!error && data && data.token){
            const token = jwtDecode<JwtPayload>(data.token)
            const { exp, iat } = token

            
            dbgLog("query.ts", ["createApi","endpoints","postLogin","onCacheEntryAdded"], "queryArg", queryArg, "data", data, "error", error, "data.token", data.token, "token", token, "exp", exp, "iat", iat)
            

            // expire after logout or jwt exp date:
            const timeout = setTimeout(() => {
              /** @todo Logic accounting for exp, iat, and nbf, */
              
              dbgLog("query.ts", ["createApi","endpoints","postLogin","onCacheEntryAdded","setTimeout(,Number(exp) - Number(iat))"], "queryArg", queryArg, "data", data, "error", error, "data.token", data.token, "token", token, "exp", exp, "iat", iat)
              
            }, Number(exp) - Number(iat))
          }
        } catch (e){
          console.error(e)
        }
      }
    }),
    postLogout: builder.mutation<SessionType, string>({
      invalidatesTags: ["User"],
      query(token){
        return {
          method: "POST",
          url: "/logout",
          headers: new Headers([["Authorization", `Bearer ${token}`]])
        }
      }
    }),
    postList: builder.mutation<List, SaveListParams>({
      query({ parts, token }){
        if (token) return {
          method: "POST",
          url: "/profile/lists",
          body: JSON.stringify({parts}),
          headers: new Headers([["Content-Type", "application/json"], ["Authorization", `Bearer ${token}`]])
        }
        else return {
          method: "POST",
          url: "/lists",
          body: JSON.stringify({parts}),
          headers: new Headers([["Content-Type", "application/json"]])
        }
      }
    }),
    patchList: builder.mutation<SessionType | ModifyResponce, EditListParams>({
      invalidatesTags: (_result, _error, { id }) => id ? [{ type: "List", id }] : [],
      query({ id, parts, token }){
        if (token) return {
          method: "PATCH",
          url: `/profile/lists/id/${id}`,
          body: JSON.stringify({parts}),
          headers: new Headers([["Content-Type", "application/json"], ["Authorization", `Bearer ${token}`]])
        }
        else return {
          method: "PATCH",
          url: `/lists/id/${id}`,
          body: JSON.stringify({parts}),
          headers: new Headers([["Content-Type", "application/json"]])
        }
      }
    }),
    patchUser: builder.mutation<SessionType, PatchUserParams>({
      invalidatesTags: ["User"],
      query({ username, token }){
        return {
          method: "PATCH",
          url: `/profile`,
          body: JSON.stringify({username}),
          headers: new Headers([["Content-Type", "application/json"], ["Authorization", `Bearer ${token}`]])
        }
      }
    }),
    deleteList: builder.mutation<SessionType | DeleteResponce, DeleteListParams>({
      invalidatesTags: (_result, _error, { id }) => id ? [{ type: "List", id }] : ["List"],
      query({ id, token }){
        if (token) return {
          method: "DELETE",
          url: `/profile/lists/id/${id}`,
          headers: new Headers([["Authorization", `Bearer ${token}`]])
        }
        else return {
          method: "DELETE",
          url: `/lists/id/${id}`,
          headers: new Headers([["Authorization", `Bearer ${token}`]])
        }
      }
    }),
    deleteUser: builder.mutation<SessionType, string>({
      invalidatesTags: ["User"],
      query(token){
        return {
          method: "DELETE",
          url: `/profile`,
          headers: new Headers([["Authorization", `Bearer ${token}`]])
        }
      }
    }),
  })
})

export const { 
  util, 
  usePrefetch, 
  // GET:
  useFetchPartsQuery, useLazyFetchPartsQuery, 
  useFetchNewsQuery, useLazyFetchNewsQuery, 
  useFetchListsQuery, useLazyFetchListsQuery, 
  useFetchUserQuery, useLazyFetchUserQuery, 
  // POST:
  usePostLoginQuery, useLazyPostLoginQuery, 
  usePostListMutation, 
  usePostLogoutMutation, 
  // PATCH:
  usePatchListMutation, 
  usePatchUserMutation, 
  // DELETE:
  useDeleteUserMutation, 
  useDeleteListMutation, 
} = rtkQueryAPISlice
