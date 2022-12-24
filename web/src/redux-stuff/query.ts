import { createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import jwtDecode, { JwtPayload } from "jwt-decode"
import {
  dbgLog,
  PCPartSearchURI,
  SessionUser,
  PCPartSearchParamsState,
  PCPartInfo,
  DeleteListParams,
  EditListParams,
  FetchListParams,
  FetchSubsetParams,
  List,
  NewsStory,
  PatchUserParams,
  SaveListParams,
  SessionType,
  ModifyResponce,
  DeleteResponce,
  LoginOrSigninCredentials
} from "~types/api"

// debugging logger:
const log = dbgLog.fileLogger("query.ts")

export const rtkQueryAPISlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1"
  }),
  tagTypes: ["List", "Part", "User"],
  endpoints: builder => ({
    /**
     * Redux Tool Kit Query endpoint for GET requests to fetch news stories from database.
     */
    getNews: builder.query<NewsStory[], FetchSubsetParams>({
      query: ({ offset, limit }) => {
        const query = `/news?${new URLSearchParams({ offset: offset as any, limit: limit as any })}`

        // prettier-ignore
        log(["createApi", "endpoints", "getNews", "query"],
          "limit", limit,
          "offset", offset,
          "query", query
        )

        return query
      }
    }),
    /**
     * Redux Tool Kit Query endpoint for GET requests to fetch PC parts from database.
     */
    getParts: builder.query<PCPartInfo[], PCPartSearchParamsState>({
      providesTags: (result, _error, _queryArg) =>
        result instanceof Array ? result.map(({ _id: id }) => ({ type: "Part", id })) : ["Part"],
      query(URIParamsState) {
        const URIParams = new PCPartSearchURI(URIParamsState)

        /** @todo For Content-Type: application/x-www-form-urlencoded, spaces are to be replaced by "+", so one may wish to follow a encodeURIComponent() replacement with an additional replacement of "%20" with "+". */
        const query = `/parts?${URIParams.toString()}`

        // prettier-ignore
        log(["createApi", "endpoints", "fetchParts", "query"],
          "URIParams", URIParams,
          "URIParams.toURI()", URIParams.toURI(),
          "URIParams.toURIEncoded()", URIParams.toURIEncoded(),
          "'?'+URIParams.toString()", `?${URIParams.toString()}`,
          "query", query
        )

        return query
      }
    }),
    /**
     * Redux Tool Kit Query endpoint for GET requests to fetch PC part lists from database.
     */
    getLists: builder.query<List | List[], FetchListParams>({
      providesTags: (result, _error, _queryArg) =>
        result
          ? result instanceof Array
            ? result.map(({ _id: id }) => ({ type: "List" as "List", id }))
            : [{ type: "List", id: result._id }]
          : ["List"],
      query({ token, id, offset, limit }) {
        let params = new URLSearchParams()
        if (typeof offset === "number") params.append("offset", offset.toString())
        if (typeof limit === "number") params.append("limit", limit.toString())
        let queryParams = params.toString()

        const query = queryParams ? `?${queryParams}` : ""

        let queryString: string | FetchArgs

        if (token) {
          // get one user's list by id:
          if (id)
            queryString = {
              method: "GET",
              url: `/profile/lists/id/${id}`,
              headers: new Headers([["Authorization", `Bearer ${token}`]])
            } as const
          // get user's lists:
          else
            queryString = {
              method: "GET",
              url: `/profile/lists${query}`,
              headers: new Headers([["Authorization", `Bearer ${token}`]])
            }
        } else {
          // get list by id:
          if (id) queryString = `/lists/id/${id}`
          // get all lists:
          else queryString = `/lists${query}`
        }

        // prettier-ignore
        log(["createApi", "endpoints", "getLists", "query"],
          "token", token,
          "id", id,
          "offset", offset,
          "limit", limit,
          "params", params,
          "queryParams", queryParams,
          "query", query,
          "queryString", queryString
        )

        return queryString
      }
    }),
    /**
     * Redux Tool Kit Query endpoint for GET requests to fetch user from database.
     */
    getUser: builder.query<SessionUser, SessionUser["_id"]>({
      providesTags: (result, _error, _queryArg) =>
        result
          ? result instanceof Array
            ? result.map(({ _id: id }) => ({ type: "User", id }))
            : [{ type: "User", id: result._id }]
          : ["User"],
      query: id => {
        const query = `/users/id/${id}`

        // prettier-ignore
        log(["createApi", "endpoints", "getUser", "query"],
          "id", id,
          "query", query,
        )

        return query
      }
      /* onCacheEntryAdded(queryArg, { cacheDataLoaded, cacheEntryRemoved, dispatch, extra, getCacheEntry, getState,requestId, updateCachedData }) {

      } */
    }),
    /**
     * Redux Tool Kit Query endpoint for POST requests to get login token from server.
     */
    postLogin: builder.query<SessionType, LoginOrSigninCredentials>({
      providesTags: ["User"],
      /** @todo Expire at JWT expiration time, accounting for refresh tokens. */
      keepUnusedDataFor: Infinity,
      query({ username, password, createUser }) {
        let query: FetchArgs

        if (createUser)
          query = {
            method: "POST",
            url: "/signup",
            body: {
              username,
              password
            }
          }
        else
          query = {
            method: "POST",
            url: "/login",
            body: {
              username,
              password
            }
          }

        // prettier-ignore
        log(["createApi", "endpoints", "postLogin", "query"],
          "username", username,
          "password", password,
          "createUser", createUser,
          "query", query,
        )

        return query
      },
      /** @todo Expire at JWT expiration time, accounting for refresh tokens. */
      async onCacheEntryAdded(
        queryArg,
        { dispatch, getState, extra, requestId, cacheEntryRemoved, cacheDataLoaded, getCacheEntry, updateCachedData }
      ) {
        const Log = log.stackLogger(["createApi", "endpoints", "postLogin", "onCacheEntryAdded"])

        Log(
          "extra",
          extra,
          "requestId",
          requestId,
          "cacheDataLoaded",
          cacheDataLoaded,
          "cacheEntryRemoved",
          cacheEntryRemoved
        )

        /** @todo Expire at JWT expiration time, accounting for refresh tokens. */
        try {
          // get token from successful login:
          const { data, error } = getCacheEntry()

          // prettier-ignore
          Log(
            "queryArg", queryArg,
            "data", data,
            "error", error,
            "data.token", data?.token
          )

          // check successful login:
          if (!error && data && data.token) {
            const token = jwtDecode<JwtPayload>(data.token)
            const { exp, iat } = token

            // prettier-ignore
            Log(
              "queryArg", queryArg,
              "data", data,
              "error", error,
              "data.token", data.token,
              "token", token,
              "exp", exp,
              "iat", iat
            )

            // expire after logout or jwt exp date:
            const timeout = setTimeout(() => {
              /** @todo Logic accounting for exp, iat, and nbf. */

              // prettier-ignore
              Log.stackLoggerInc("setTimeout(,(exp - iat) * 1000)")(
                "queryArg", queryArg,
                "data", data,
                "error", error,
                "data.token", data.token,
                "token", token,
                "exp", exp,
                "iat", iat
              )
            }, (Number(exp) - Number(iat)) * 1000)
          }
        } catch (e) {
          Log.stackLoggerInc("catch").error("err", e)
        }
      }
    }),
    /**
     * Redux Tool Kit Query endpoint for POST requests to logout.
     */
    postLogout: builder.mutation<SessionType, string>({
      invalidatesTags: ["User"],
      query(token) {
        const query: FetchArgs = {
          method: "POST",
          url: "/logout",
          headers: new Headers([["Authorization", `Bearer ${token}`]])
        }

        // prettier-ignore
        log(["createApi", "endpoints", "postLogout", "query"],
          "token", token,
          "query", query,
        )

        return query
      }
    }),
    /**
     * Redux Tool Kit Query endpoint for POST requests to add PC part list to database.
     */
    postList: builder.mutation<List, SaveListParams>({
      query({ parts, token }) {
        let query: FetchArgs

        if (token)
          query = {
            method: "POST",
            url: "/profile/lists",
            body: JSON.stringify({ parts }),
            headers: new Headers([
              ["Content-Type", "application/json"],
              ["Authorization", `Bearer ${token}`]
            ])
          }
        else
          query = {
            method: "POST",
            url: "/lists",
            body: JSON.stringify({ parts }),
            headers: new Headers([["Content-Type", "application/json"]])
          }

        // prettier-ignore
        log(["createApi", "endpoints", "postList", "query"],
        "parts", parts,
        "token", token,
        "query", query,
      )

        return query
      }
    }),
    /**
     * Redux Tool Kit Query endpoint for PATCH requests to update list on database.
     */
    patchList: builder.mutation<SessionType | ModifyResponce, EditListParams>({
      invalidatesTags: (_result, _error, { id }) => (id ? [{ type: "List", id }] : []),
      query({ id, parts, token }) {
        let query: FetchArgs

        if (token)
          query = {
            method: "PATCH",
            url: `/profile/lists/id/${id}`,
            body: JSON.stringify({ parts }),
            headers: new Headers([
              ["Content-Type", "application/json"],
              ["Authorization", `Bearer ${token}`]
            ])
          }
        else
          query = {
            method: "PATCH",
            url: `/lists/id/${id}`,
            body: JSON.stringify({ parts }),
            headers: new Headers([["Content-Type", "application/json"]])
          }

        // prettier-ignore
        log(["createApi", "endpoints", "patchList", "query"],
          "id", id,
          "parts", parts,
          "token", token,
          "query", query,
        )

        return query
      }
    }),
    /**
     * Redux Tool Kit Query endpoint for PATCH requests to update user on database.
     */
    patchUser: builder.mutation<SessionType, PatchUserParams>({
      invalidatesTags: ["User"],
      query({ username, token }) {
        const query: FetchArgs = {
          method: "PATCH",
          url: `/profile`,
          body: JSON.stringify({ username }),
          headers: new Headers([
            ["Content-Type", "application/json"],
            ["Authorization", `Bearer ${token}`]
          ])
        }

        // prettier-ignore
        log(["createApi", "endpoints", "patchUser", "query"],
          "username", username,
          "token", token,
          "query", query,
        )

        return query
      }
    }),
    /**
     * Redux Tool Kit Query endpoint for DELETE requests to delete PC part lists from database.
     */
    deleteList: builder.mutation<SessionType | DeleteResponce, DeleteListParams>({
      invalidatesTags: (_result, _error, { id }) => (id ? [{ type: "List", id }] : ["List"]),
      query({ id, token }) {
        let query: FetchArgs

        if (token)
          query = {
            method: "DELETE",
            url: `/profile/lists/id/${id}`,
            headers: new Headers([["Authorization", `Bearer ${token}`]])
          }
        else
          query = {
            method: "DELETE",
            url: `/lists/id/${id}`,
            headers: new Headers([["Authorization", `Bearer ${token}`]])
          }

        // prettier-ignore
        log(["createApi", "endpoints", "deleteList", "query"],
          "id", id,
          "token", token,
          "query", query,
        )

        return query
      }
    }),
    /**
     * Redux Tool Kit Query endpoint for DELETE requests to delete logged-in user from database.
     */
    deleteUser: builder.mutation<SessionType, string>({
      invalidatesTags: ["User"],
      query(token) {
        const query: FetchArgs = {
          method: "DELETE",
          url: `/profile`,
          headers: new Headers([["Authorization", `Bearer ${token}`]])
        }

        // prettier-ignore
        log(["createApi", "endpoints", "deleteUser", "query"],
          "token", token,
          "query", query,
        )

        return query
      }
    })
  })
})

export const {
  usePrefetch,
  // GET:
  useGetPartsQuery,
  useLazyGetPartsQuery,
  useGetNewsQuery,
  useLazyGetNewsQuery,
  useGetListsQuery,
  useLazyGetListsQuery,
  useGetUserQuery,
  useLazyGetUserQuery,
  // POST:
  usePostLoginQuery,
  useLazyPostLoginQuery,
  usePostListMutation,
  usePostLogoutMutation,
  // PATCH:
  usePatchListMutation,
  usePatchUserMutation,
  // DELETE:
  useDeleteUserMutation,
  useDeleteListMutation
} = rtkQueryAPISlice
