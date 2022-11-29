import Big, { BigSource } from "big.js"
import { ArrayWithTypes } from "./array-type"
import type { ArrayWithTypesOpts } from "./array-type"


/**
 * @file A bunch of typea and helpera for stuff.
 */


/** 
 * Debugging log helper, formats and prints values in a easy to read layout, with source file and stack-trace-like info.
 * 
 * @prop {@link FileLoggerFactory} fileLogger Returns a function that calls the debug logger with a preset file name for all invokations.
 * @param file The file the logging function is being called from.
 * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
 * @param logs The variables the logging function is outputing the values of. 
 * @example 
 * // in the form: ("string for variable name", variable):
 * dbgLog(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 */
const dbgLog: Logger = (file: string, trace: string | string[], ...logs: Array<string | any>) => {
  try {
    console.log(
      `${"-".repeat(8)}${file}${"-".repeat(8)}\n`,
      `> ${[trace].flat(1).map(str => str.endsWith(")") ? str : `${str}()`).join(" > ")}:\n`,
      /* display the var name as: `\nVarName: ${VarValue}` */
      ...logs.map((varNameOrVal: string | any, index) => index % 2 === 1 ? 
      varNameOrVal 
      : `${(varNameOrVal as string)?.startsWith?.("\n") ? "" : "\n"}${varNameOrVal}${(varNameOrVal as string)?.endsWith?.(":") ? "" : ":"}`
      )
    )
  } catch(e){
    console.error(e)
  }
}

/** 
 * Helper for the debugging log helper, returns a function that calls the debug logger with a preset file name for all invokations.
 * 
 * @param file The file the logging function is being called from.
 * @returns {@link FileLogger} The function the will have a preset file, other args same as dbgLog.
 * @example 
 * const log = dbgLog.fileLogger(file)
 * log(trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 * // same as dbgLog(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
 */
export const dbgFileLogger: FileLoggerFactory = (file: string) => {
  const fileFn = (...args: [trace: string | string[], ...logs: Array<string | any>]) => dbgLog(file, ...args)

  /** @readonly */
  fileFn.file = file
  
  /** 
   * Helper for the file debug log helper, returns a function that calls the debug file logger with a preset stack trace for all invokations.
   * 
   * @param trace The function location the logging function is being called from. Nested function should have a Function.name array.
   * @returns {@link StackLogger} The debug logger function with a preset stack trace value.
   * @example 
   * const fileLogger = dbgLog.fileLogger(file)
   * const log = fileLogger.stackLogger(trace)
   * log("variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   * // same as dbgLog(file, trace, "variableName1", varaibleName1, "variableName2", varaibleName2, ...etc)
   */
  fileFn.stackLogger = (trace: string | string[]) => {
    const stackFn = (...logs: Array<string | any>) => fileFn(trace, ...logs)
    
    /** @readonly */
    stackFn.file = fileFn.file
    
    /** @readonly */
    stackFn.trace = trace
    
    
    return stackFn
  }
  
  
  return fileFn
}

export type LogFn = (file: string, trace: string | string[], ...logs: Array<string | any>) => void
export type FileLogFn = (trace: string | string[], ...logs: Array<string | any>) => void
export type StackLogFn = (...logs: Array<string | any>) => void

export type Logger = LogFn & LoggerProps
export type FileLogger = FileLogFn & FileLoggerProps
export type StackLogger = StackLogFn & StackLoggerProps

export type FileLoggerFactory = (file: string) => FileLogger
export type StackLoggerFactory = (trace: string | string[]) => StackLogger

export interface LoggerProps extends Function {
  fileLogger: FileLoggerFactory
}  

export interface FileLoggerProps extends Function {
  stackLogger: StackLoggerFactory
  file?: string
}  

export interface StackLoggerProps extends Function {
  file: string
  trace: string | string[]
}

dbgLog.fileLogger = dbgFileLogger

export { dbgLog }


/** User login jwt session details. */
export interface SessionUser {
  _id: string
  username: string
  password?: string
  lists: string[]
}

export interface PatchUserParams {
  username: string,
  token: string
}

export interface DeleteListParams {
  id: string,
  token?: string
}

export interface FetchSubsetParams {
  offset?: number
  limit?: number
}

export type FetchListParams = FetchSubsetParams & {
  id?: string
} & ({
  token: string
} | {
  token?: never
})

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
  modifiedCount?: number,
  upsertedId?: string | null,
  upsertedCount?: number,
  matchedCount?: number,
}
export type DeleteResponce = DBAckRes & DBDeleteRes
export type ModifyResponce = DBAckRes & DBModifyRes


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
  memory?: `${"Q"|"D"|"S"}DR${string}`
  memorySpeed?: `DDR${number}-${number}`
  memoryChannels?: number
  cores?: number
  pCores?: number | boolean
  eCores?: number | boolean
  threads?: number
  SMT?: boolean
  hyperthreading?: boolean
  baseClock?: `${number}${"G"|"M"|"K"}Hz`
  boostClock?: `${number}${"G"|"M"|"K"}Hz`
  TjMax?: `${number}C`
  TDP?: `${number}W`
  L1Cache?: `${number}${"M"|"K"}B` | boolean
  L2Cache?: `${number}${"M"|"K"}B` | boolean
  L3Cache?: `${number}${"M"|"K"}B` | boolean
  graphincs?: string | boolean
  graphincsArchitechure?: string
  graphincsCores?: number
  graphincsBaseClock?: `${number}${"G"|"M"|"K"}Hz`
  graphincsBoostClock?: `${number}${"G"|"M"|"K"}Hz`
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

export const idFilterBuilder = (opts?: Omit<ArrayWithTypesOpts<string>, "type">) => new ArrayWithTypes<string>({ ...opts, type: "string" })
export const oemFilterBuilder = (opts?: Omit<ArrayWithTypesOpts<string>, "type">) => new ArrayWithTypes<string>({ ...opts, type: "string" })
export const typeFilterBuilder = (opts?: Omit<ArrayWithTypesOpts<PCPartType>, "type" | "typeCoercer" | "isTypeCoercible">) => new ArrayWithTypes<PCPartType>({
  ...opts,
  type: (PCPartType as unknown as PCPartType),
  // @ts-ignore This is valid for enums in the emited JS, Object.hasOwn will return only the enum values:
  typeCoercer: (v) => (typeof v === "string" && Object.hasOwn(PCPartType, v)) ? PCPartType[v] : undefined,
  isTypeCoercible: (v) => (typeof v === "string" && Object.hasOwn(PCPartType, v)) ? true : false
})

export class PCPartSearchURI {
  // private class members to ensure type saftey:
  #idFilter = idFilterBuilder()
  #oemFilter  = oemFilterBuilder()
  #typeFilter = typeFilterBuilder()
  #maxPriceFilter?: Big | undefined
  #minPriceFilter?: Big | undefined

  /** 
   * @summary Sanitize args to and from URI search query for use in database server.
   */
  constructor(config: { ids?: string | string[], types?: string | string[], oems?: string | string[], maxPrice?: Big | string, minPrice?: Big | string } = {}){    
    // database ids:
    if (Array.isArray(config.ids)) this.#idFilter.push(...config.ids)
    else this.#idFilter.push(config.ids as string)
    
    // PC part types:
    if (Array.isArray(config.types)) this.#typeFilter.push(...(config.types as PCPartType[]))
    else  this.#typeFilter.push(config.types as PCPartType)
    
    // manufacturers:
    if (Array.isArray(config.oems)) this.#oemFilter.push(...config.oems)
    else this.#oemFilter.push(config.oems as string)

    // curreny value as Big decimal:
    if (config.minPrice) this.minPriceFilter = config.minPrice
    if (config.maxPrice) this.maxPriceFilter = config.maxPrice

    dbgLog("api.ts", ["class PCPartSearchURI","constructor"], "this", this, "config", config)
  }
  
  /** @prop {?Big|undefined} minPriceFilter Sets the value to a Big by coercing to type Big. Can coerce strings, but using the number type is discouraged since they are floats not ints. Set to undefined to clear value. */
  set minPriceFilter(newValue: Exclude<BigSource, number> | undefined){
    if (newValue === undefined) this.#minPriceFilter = newValue
    if (newValue) this.#minPriceFilter = Big(newValue)
  }
  get minPriceFilter(): Big | undefined {
    return this.#minPriceFilter
  }
  
  /** @prop {?Big|undefined} minPriceFilter Sets the value to a Big by coercing to type Big. Can coerce strings, but using the number type is discouraged since they are floats not ints. Set to undefined to clear value. */
  set maxPriceFilter(newValue: Exclude<BigSource, number> | undefined){
    if (newValue === undefined) this.#maxPriceFilter = newValue
    if (newValue) this.#maxPriceFilter = Big(newValue)
  }
  get maxPriceFilter(): Big | undefined {
    return this.#maxPriceFilter
  }

  get filterIDs(){
    return this.#idFilter
  }
  
  get filterTypes(){
    return this.#typeFilter
  }

  get filterOEMs(){
    return this.#oemFilter
  }

  toURI(){
    const params: [string, string][] = []
    if (this.#maxPriceFilter) params.push(["maxPrice", this.#maxPriceFilter.toString()])
    if (this.#minPriceFilter) params.push(["minPrice", this.#minPriceFilter.toString()])
    if (this.#idFilter.length > 0) this.#idFilter.forEach(id => params.push(["ids", id]))
    if (this.#typeFilter.length > 0) this.#typeFilter.forEach(type => params.push(["types", type]))
    if (this.#oemFilter.length > 0) this.#oemFilter.forEach(oem => params.push(["oems", oem]))
    
    const query = new URLSearchParams(params)

    dbgLog("api.ts", ["class PCPartSearchURI","toURI"], "query", query, "params", params)
    
    return query
  }

  toURIEncoded(){
    const params: [string, string][] = []
    if (this.#maxPriceFilter) params.push(["maxPrice", encodeURIComponent(this.#maxPriceFilter.toString())])
    if (this.#minPriceFilter) params.push(["minPrice", encodeURIComponent(this.#minPriceFilter.toString())])
    if (this.#idFilter.length > 0) this.#idFilter.forEach(id => params.push(["ids", encodeURIComponent(id)]))
    if (this.#typeFilter.length > 0) this.#typeFilter.forEach(type => params.push(["types", encodeURIComponent(type)]))
    if (this.#oemFilter.length > 0) this.#oemFilter.forEach(oem => params.push(["oems", encodeURIComponent(oem)]))
    
    const query = new URLSearchParams(params)

    dbgLog("api.ts", ["class PCPartSearchURI","toURI"], "query", query, "params", params, "this", this)
    
    return query
  }

  toString(){
    const queryString = this.toURI().toString()

    dbgLog("api.ts", ["class PCPartSearchURI","toString"], "queryString", queryString, "this", this)

    return queryString
  }
}

export const filterDB = (data: PCPartInfo[], query:  | PCPartSearchParamsState | Record<string, string | string[]> | Record<string, any>): PCPartInfo[] => {
  const params = new PCPartSearchURI({
    ...query,
    ids: ((query as any).id ?? query.ids as any),
    oems: ((query as any).oem ?? query.oems as any),
    types: ((query as any).type ?? query.types as any),
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
      if (params.minPriceFilter instanceof Big && params.maxPriceFilter instanceof Big) res = res.filter(
        ({ MSRP }) => params.minPriceFilter?.lte(MSRP) && params.maxPriceFilter?.gte(MSRP)
      )
    }
  }
  
  return res
}