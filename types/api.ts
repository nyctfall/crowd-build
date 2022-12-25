import Big, { BigSource } from "big.js"
import { ArrayWithTypes } from "./array-type"
import type { ArrayWithTypesOpts } from "./array-type"
import { dbgLog } from "./logger"
export { dbgLog }
export * from "./logger"

/**
 * @file A bunch of typea and helpera for stuff.
 */

const log = dbgLog.fileLogger("api.ts")

/** User login jwt session details. */
export interface SessionUser {
  _id: string
  username: string
  password?: string
  lists: string[]
}

export interface PatchUserParams {
  username: string
  token: string
}

export interface DeleteListParams {
  id: string
  token?: string
}

export interface FetchSubsetParams {
  offset?: number
  limit?: number
}

export type FetchListParams = FetchSubsetParams & {
  id?: string
} & (
    | {
        token: string
      }
    | {
        token?: never
      }
  )

export interface SaveListParams {
  token?: string
  parts: string[]
}

export type EditListParams = SaveListParams & {
  id: string
}

export interface LoginCredentials {
  username: string
  password: string
}
export interface LoginOrSigninCredentials {
  username: string
  password: string
  createUser?: boolean
}

export interface List {
  _id: string
  createdAt: string | Date
  updatedAt: string | Date
  user?: string
  parts: string[]
}

export interface SessionType {
  token?: string
  success: boolean
  user?: SessionUser
  conflict?: boolean
  nonexistant?: boolean
  preexisting?: string[]
  incorrect?: string[]
}

interface DBAckRes {
  acknowledged: boolean
}
interface DBDeleteRes {
  deletedCount?: number
}
interface DBModifyRes {
  modifiedCount?: number
  upsertedId?: string | null
  upsertedCount?: number
  matchedCount?: number
}
export type DeleteResponce = DBAckRes & DBDeleteRes
export type ModifyResponce = DBAckRes & DBModifyRes

/**
 * HTTP status code to name enum.
 */
export enum HTTPStatusCode {
  /**
   * This interim response indicates that the client should continue the request or ignore the response if the request is already finished.
   */
  "Continue" = 100,
  /**
   * This code is sent in response to an `Upgrade` request header from the client and indicates the protocol the server is switching to.
   */
  "Switching Protocols" = 101,
  /**
   * This code indicates that the server has received and is processing the request, but no response is available yet.
   */
  "Processing" = 102,
  /**
   * This status code is primarily intended to be used with the `Link` header, letting the user agent start preloading resources while the server prepares a response.
   */
  "Early Hints" = 103,
  /**
   * The request succeeded. The result meaning of "success" depends on the HTTP method:
   * - `GET`: The resource has been fetched and transmitted in the message body.
   * - `HEAD`: The representation headers are included in the response without any message body.
   * - `PUT` or `POST`: The resource describing the result of the action is transmitted in the message body.
   * - `TRACE`: The message body contains the request message as received by the server.
   */
  "OK" = 200,
  /**
   * The request succeeded, and a new resource was created as a result. This is typically the response sent after `POST` requests, or some `PUT` requests.
   */
  "Created" = 201,
  /**
   * The request has been received but not yet acted upon. It is noncommittal, since there is no way in HTTP to later send an asynchronous response indicating the outcome of the request. It is intended for cases where another process or server handles the request, or for batch processing.
   */
  "Accepted" = 202,
  /**
   * This response code means the returned metadata is not exactly the same as is available from the origin server, but is collected from a local or a third-party copy. This is mostly used for mirrors or backups of another resource. Except for that specific case, the 200 OK response is preferred to this status.
   */
  "Non-Authoritative Information" = 203,
  /**
   * There is no content to send for this request, but the headers may be useful. The user agent may update its cached headers for this resource with the new ones.
   */
  "No Content" = 204,
  /**
   * Tells the user agent to reset the document which sent this request.
   */
  "Reset Content" = 205,
  /**
   * This response code is used when the Range header is sent from the client to request only part of a resource.
   */
  "Partial Content" = 206,
  /**
   * Conveys information about multiple resources, for situations where multiple status codes might be appropriate.
   */
  "Multi-Status" = 207,
  /**
   * Used inside a `<dav:propstat>` response element to avoid repeatedly enumerating the internal members of multiple bindings to the same collection.
   */
  "Already Reported" = 208,
  /**
   * The server has fulfilled a `GET` request for the resource, and the response is a representation of the result of one or more instance-manipulations applied to the current instance.
   */
  "IM Used" = 226,
  /**
   * The request has more than one possible response. The user agent or user should choose one of them. (There is no standardized way of choosing one of the responses, but HTML links to the possibilities are recommended so the user can pick.)
   */
  "Multiple Choices" = 300,
  /**
   * The URL of the requested resource has been changed permanently. The new URL is given in the response.
   */
  "Moved Permanently" = 301,
  /**
   * This response code means that the URI of requested resource has been changed temporarily. Further changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
   */
  "Found" = 302,
  /**
   * The server sent this response to direct the client to get the requested resource at another URI with a `GET` request.
   */
  "See Other" = 303,
  /**
   * This is used for caching purposes. It tells the client that the response has not been modified, so the client can continue to use the same cached version of the response.
   */
  "Not Modified" = 304,
  /**
   * @deprecated Defined in a previous version of the HTTP specification to indicate that a requested response must be accessed by a proxy. It has been deprecated due to security concerns regarding in-band configuration of a proxy.
   */
  "Use Proxy" = 305,
  /**
   * @deprecated This response code is no longer used; it is just reserved. It was used in a previous version of the HTTP/1.1 specification.
   */
  "unused" = 306,
  /**
   * The server sends this response to direct the client to get the requested resource at another URI with same method that was used in the prior request. This has the same semantics as the `302 Found` HTTP response code, with the exception that the user agent must not change the HTTP method used: if a `POST` was used in the first request, a `POST` must be used in the second request.
   */
  "Temporary Redirect" = 307,
  /**
   * This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header. This has the same semantics as the `301 Moved Permanently` HTTP response code, with the exception that the user agent must not change the HTTP method used: if a `POST` was used in the first request, a `POST` must be used in the second request.
   */
  "Permanent Redirect" = 308,
  /**
   * The server cannot or will not process the request due to something that is perceived to be a client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing).
   */
  "Bad Request" = 400,
  /**
   * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
   */
  "Unauthorized" = 401,
  /**
   * This response code is reserved for future use. The initial aim for creating this code was using it for digital payment systems, however this status code is used very rarely and no standard convention exists.
   */
  "Payment Required" = 402,
  /**
   * The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the client's identity is known to the server.
   */
  "Forbidden" = 403,
  /**
   * The server cannot find the requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of `403 Forbidden` to hide the existence of a resource from an unauthorized client. This response code is probably the most well known due to its frequent occurrence on the web.
   */
  "Not Found" = 404,
  /**
   * The request method is known by the server but is not supported by the target resource. For example, an API may not allow calling `DELETE` to remove a resource.
   */
  "Method Not Allowed" = 405,
  /**
   * This response is sent when the web server, after performing server-driven content negotiation, doesn't find any content that conforms to the criteria given by the user agent.
   */
  "Not Acceptable" = 406,
  /**
   * This is similar to `401 Unauthorized` but authentication is needed to be done by a proxy.
   */
  "Proxy Authentication Required" = 407,
  /**
   * This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.
   */
  "Request Timeout" = 408,
  /**
   * This response is sent when a request conflicts with the current state of the server.
   */
  "Conflict" = 409,
  /**
   * This response is sent when the requested content has been permanently deleted from server, with no forwarding address. Clients are expected to remove their caches and links to the resource. The HTTP specification intends this status code to be used for "limited-time, promotional services". APIs should not feel compelled to indicate resources that have been deleted with this status code.
   */
  "Gone" = 410,
  /**
   * Server rejected the request because the Content-Length header field is not defined and the server requires it.
   */
  "Length Required" = 411,
  /**
   * The client has indicated preconditions in its headers which the server does not meet.
   */
  "Precondition Failed" = 412,
  /**
   * Request entity is larger than limits defined by server. The server might close the connection or return an `Retry-After` header field.
   */
  "Payload Too Large" = 413,
  /**
   * The URI requested by the client is longer than the server is willing to interpret.
   */
  "URI Too Long" = 414,
  /**
   * The media format of the requested data is not supported by the server, so the server is rejecting the request.
   */
  "Unsupported Media Type" = 415,
  /**
   * The range specified by the `Range` header field in the request cannot be fulfilled. It's possible that the range is outside the size of the target URI's data.
   */
  "Range Not Satisfiable" = 416,
  /**
   * This response code means the expectation indicated by the `Expect` request header field cannot be met by the server.
   */
  "Expectation Failed" = 417,
  /**
   * The server refuses the attempt to brew coffee with a teapot.
   */
  "I'm a teapot" = 418,
  /**
   * The request was directed at a server that is not able to produce a response. This can be sent by a server that is not configured to produce responses for the combination of scheme and authority that are included in the request URI.
   */
  "Misdirected Request" = 421,
  /**
   * The request was well-formed but was unable to be followed due to semantic errors.
   */
  "Unprocessable Entity" = 422,
  /**
   * The resource that is being accessed is locked.
   */
  "Locked" = 423,
  /**
   * The request failed due to failure of a previous request.
   */
  "Failed Dependency" = 424,
  /**
   * Indicates that the server is unwilling to risk processing a request that might be replayed.
   */
  "Too Early" = 425,
  /**
   * The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol. The server sends an `Upgrade` header in a `426` response to indicate the required protocol(s).
   */
  "Upgrade Required" = 426,
  /**
   * The origin server requires the request to be conditional. This response is intended to prevent the 'lost update' problem, where a client `GET`s a resource's state, modifies it and `PUT`s it back to the server, when meanwhile a third party has modified the state on the server, leading to a conflict.
   */
  "Precondition Required" = 428,
  /**
   * The user has sent too many requests in a given amount of time ("rate limiting").
   */
  "Too Many Requests" = 429,
  /**
   * The server is unwilling to process the request because its header fields are too large. The request may be resubmitted after reducing the size of the request header fields.
   */
  "Request Header Fields Too Large" = 431,
  /**
   * The user agent requested a resource that cannot legally be provided, such as a web page censored by a government.
   */
  "Unavailable For Legal Reasons" = 451,
  /**
   * The server has encountered a situation it does not know how to handle.
   */
  "Internal Server Error" = 500,
  /**
   * The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are `GET` and `HEAD`.
   */
  "Not Implemented" = 501,
  /**
   * This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
   */
  "Bad Gateway" = 502,
  /**
   * The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This response should be used for temporary conditions and the `Retry-After` HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.
   */
  "Service Unavailable" = 503,
  /**
   * This error response is given when the server is acting as a gateway and cannot get a response in time.
   */
  "Gateway Timeout" = 504,
  /**
   * The HTTP version used in the request is not supported by the server.
   */
  "HTTP Version Not Supported" = 505,
  /**
   * The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process.
   */
  "Variant Also Negotiates" = 506,
  /**
   * The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request.
   */
  "Insufficient Storage" = 507,
  /**
   * The server detected an infinite loop while processing the request.
   */
  "Loop Detected" = 508,
  /**
   * Further extensions to the request are required for the server to fulfill it.
   */
  "Not Extended" = 510,
  /**
   * Indicates that the client needs to authenticate to gain network access.
   */
  "Network Authentication Required" = 511
}

export interface NewsStory {
  _id: string
  title: string
  createdAt: Date | string
  updatedAt: Date | string
  content?: string
  link?: string
}

export enum PCPartType {
  CPU = "CPU",
  GPU = "GPU",
  RAM = "RAM",
  Cooler = "Cooler",
  Motherboard = "Motherboard",
  SSD = "SSD",
  HDD = "HDD",
  SSHD = "SSHD",
  PSU = "PSU",
  Case = "Case"
}

export interface PCPartTypeInfo {
  platform?: "desktop" | "mobile" | "server" | "embedded"
  unlocked?: boolean
  codename?: Capitalize<string>
  architechure?: string
  PCIe?: `${number}.${number}`
  PIB?: string | boolean
  socket?: string
  memory?: `${"Q" | "D" | "S"}DR${string}`
  memorySpeed?: `DDR${number}-${number}`
  memoryChannels?: number
  cores?: number
  pCores?: number | boolean
  eCores?: number | boolean
  threads?: number
  SMT?: boolean
  hyperthreading?: boolean
  baseClock?: `${number}${"G" | "M" | "K"}Hz`
  boostClock?: `${number}${"G" | "M" | "K"}Hz`
  TjMax?: `${number}C`
  TDP?: `${number}W`
  L1Cache?: `${number}${"M" | "K"}B` | boolean
  L2Cache?: `${number}${"M" | "K"}B` | boolean
  L3Cache?: `${number}${"M" | "K"}B` | boolean
  graphincs?: string | boolean
  graphincsArchitechure?: string
  graphincsCores?: number
  graphincsBaseClock?: `${number}${"G" | "M" | "K"}Hz`
  graphincsBoostClock?: `${number}${"G" | "M" | "K"}Hz`
  processNode?: string
  productFamily?: string
  productLine?: string
  productIdBoxed?: string
  productIdTray?: string
}

export interface PCPartInfo {
  _id: string
  name: string
  type: PCPartType
  oem?: string
  model?: string
  released?: string
  typeInfo?: PCPartTypeInfo
  rating?: string
  ratings?: string
  MSRP: string | number
  img?: string
}

export interface PCPartSearchParamsState {
  ids: string[]
  oems: string[]
  types: PCPartType[]
  minPrice?: string | Big
  maxPrice?: string | Big
}

export const idFilterBuilder = (opts?: Omit<ArrayWithTypesOpts<string>, "type">) =>
  new ArrayWithTypes<string>({ ...opts, type: "string" })
export const oemFilterBuilder = (opts?: Omit<ArrayWithTypesOpts<string>, "type">) =>
  new ArrayWithTypes<string>({ ...opts, type: "string" })
export const typeFilterBuilder = (
  opts?: Omit<ArrayWithTypesOpts<PCPartType>, "type" | "typeCoercer" | "isTypeCoercible">
) =>
  new ArrayWithTypes<PCPartType>({
    ...opts,
    type: PCPartType as unknown as PCPartType,
    // @ts-ignore This is valid for enums in the emited JS, Object.hasOwn will return only the enum values:
    typeCoercer: v => (typeof v === "string" && Object.hasOwn(PCPartType, v) ? PCPartType[v] : undefined),
    isTypeCoercible: v => (typeof v === "string" && Object.hasOwn(PCPartType, v) ? true : false)
  })

export class PCPartSearchURI {
  // private class members to ensure type saftey:
  #idFilter = idFilterBuilder()
  #oemFilter = oemFilterBuilder()
  #typeFilter = typeFilterBuilder()
  #maxPriceFilter?: Big | undefined
  #minPriceFilter?: Big | undefined

  /**
   * @summary Sanitize args to and from URI search query for use in database server.
   */
  constructor(
    config: {
      ids?: string | string[]
      types?: string | string[]
      oems?: string | string[]
      maxPrice?: Big | string
      minPrice?: Big | string
    } = {}
  ) {
    // database ids:
    if (Array.isArray(config.ids)) this.#idFilter.push(...config.ids)
    else this.#idFilter.push(config.ids as string)

    // PC part types:
    if (Array.isArray(config.types)) this.#typeFilter.push(...(config.types as PCPartType[]))
    else this.#typeFilter.push(config.types as PCPartType)

    // manufacturers:
    if (Array.isArray(config.oems)) this.#oemFilter.push(...config.oems)
    else this.#oemFilter.push(config.oems as string)

    // curreny value as Big decimal:
    if (config.minPrice) this.minPriceFilter = config.minPrice
    if (config.maxPrice) this.maxPriceFilter = config.maxPrice

    log(["class PCPartSearchURI", "constructor"], "this", this, "config", config)
  }

  /** @prop {?Big|undefined} minPriceFilter Sets the value to a Big by coercing to type Big. Can coerce strings, but using the number type is discouraged since they are floats not ints. Set to undefined to clear value. */
  set minPriceFilter(newValue: Exclude<BigSource, number> | undefined) {
    if (newValue === undefined) this.#minPriceFilter = newValue
    if (newValue) this.#minPriceFilter = Big(newValue)
  }
  get minPriceFilter(): Big | undefined {
    return this.#minPriceFilter
  }

  /** @prop {?Big|undefined} minPriceFilter Sets the value to a Big by coercing to type Big. Can coerce strings, but using the number type is discouraged since they are floats not ints. Set to undefined to clear value. */
  set maxPriceFilter(newValue: Exclude<BigSource, number> | undefined) {
    if (newValue === undefined) this.#maxPriceFilter = newValue
    if (newValue) this.#maxPriceFilter = Big(newValue)
  }
  get maxPriceFilter(): Big | undefined {
    return this.#maxPriceFilter
  }

  get filterIDs() {
    return this.#idFilter
  }

  get filterTypes() {
    return this.#typeFilter
  }

  get filterOEMs() {
    return this.#oemFilter
  }

  toURI() {
    const params: [string, string][] = []
    if (this.#maxPriceFilter) params.push(["maxPrice", this.#maxPriceFilter.toString()])
    if (this.#minPriceFilter) params.push(["minPrice", this.#minPriceFilter.toString()])
    if (this.#idFilter.length > 0) this.#idFilter.forEach(id => params.push(["ids", id]))
    if (this.#typeFilter.length > 0) this.#typeFilter.forEach(type => params.push(["types", type]))
    if (this.#oemFilter.length > 0) this.#oemFilter.forEach(oem => params.push(["oems", oem]))

    const query = new URLSearchParams(params)

    log(["class PCPartSearchURI", "toURI"], "query", query, "params", params)

    return query
  }

  toURIEncoded() {
    const params: [string, string][] = []
    if (this.#maxPriceFilter) params.push(["maxPrice", encodeURIComponent(this.#maxPriceFilter.toString())])
    if (this.#minPriceFilter) params.push(["minPrice", encodeURIComponent(this.#minPriceFilter.toString())])
    if (this.#idFilter.length > 0) this.#idFilter.forEach(id => params.push(["ids", encodeURIComponent(id)]))
    if (this.#typeFilter.length > 0) this.#typeFilter.forEach(type => params.push(["types", encodeURIComponent(type)]))
    if (this.#oemFilter.length > 0) this.#oemFilter.forEach(oem => params.push(["oems", encodeURIComponent(oem)]))

    const query = new URLSearchParams(params)

    log(["class PCPartSearchURI", "toURI"], "query", query, "params", params, "this", this)

    return query
  }

  toString() {
    const queryString = this.toURI().toString()

    log(["class PCPartSearchURI", "toString"], "queryString", queryString, "this", this)

    return queryString
  }
}

export const filterDB = (
  data: PCPartInfo[],
  query: PCPartSearchParamsState | Record<string, string | string[]> | Record<string, any>
): PCPartInfo[] => {
  const params = new PCPartSearchURI({
    ...query,
    ids: (query as any).id ?? (query.ids as any),
    oems: (query as any).oem ?? (query.oems as any),
    types: (query as any).type ?? (query.types as any)
  })

  let res: PCPartInfo[] = data.slice()

  // get only by id:
  if (params.filterIDs.array.length > 0) res = res.filter(({ _id }) => params.filterIDs.array.includes(_id))
  else {
    // get by type:
    if (params.filterTypes.length > 0) res = res.filter(({ type }) => params.filterTypes.includes(type))

    // get by manufacturer:
    if (params.filterOEMs.length > 0) res = res.filter(({ oem }) => params.filterOEMs.includes(oem as string))

    // get by MSRP:
    if (params.minPriceFilter instanceof Big || params.maxPriceFilter instanceof Big) {
      // only get greater or equal to than min:
      if (params.minPriceFilter instanceof Big) res = res.filter(({ MSRP }) => params.minPriceFilter?.lte(MSRP))

      // only get less or equal to than max:
      if (params.maxPriceFilter instanceof Big) res = res.filter(({ MSRP }) => params.maxPriceFilter?.gte(MSRP))

      // both greater than or equal to min and less than or equal to max:
      if (params.minPriceFilter instanceof Big && params.maxPriceFilter instanceof Big)
        res = res.filter(({ MSRP }) => params.minPriceFilter?.lte(MSRP) && params.maxPriceFilter?.gte(MSRP))
    }
  }

  return res
}

/**
 * Tests to see if LocalStorage and SessionStorage can be used.
 *
 * From: @see https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
 */
export const storageAvailable = (type: "localStorage" | "sessionStorage") => {
  let storage
  try {
    storage = window[type]
    const x = "__storage_test__"
    storage.setItem(x, x)
    storage.removeItem(x)
    return true
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    )
  }
}
