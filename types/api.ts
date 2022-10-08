import Big from "big.js"

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

export interface PCPartInfo {
  name: string
  type: PCPartType
  id: string
  manufacturer?: string
  model?: string
  released?: string
  typeInfo?: Record<string, any>
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


type typeofTypes = "undefined" | "object" | "boolean" | "number" | "bigint" | "string" | "symbol" | "function"
class ArrayWithTypes<T> {
  // private class members to ensure type saftey:
  #array: T[] = []
  #type: T | string
  #isTypeCoercible = (arg: any): boolean => {
    if ((typeof this.#type === "string" && typeof arg === this.#type) || (this.#type && typeof this.#type === "object" && (typeof (this.#type as any)[Symbol.hasInstance] === "function" || typeof this.#type === "function") && arg instanceof (this.#type as any))) return true
    return false
  }
  #typeCoerce = (arg: any): T | undefined => {
    if (this.#isTypeCoercible(arg)) return arg
  }

  /**
   * @typedef {"undefined" | "object" | "boolean" | "number" | "bigint" | "string" | "symbol" | "function"} typeofTypes 
   * @param {T | typeofTypes} type The type of the value when comparing with typeof or instanceof keywords.
   * @param {? (any) => T | undefined} typeCoercer A function that type checks a value, (and possibly coerces it), or returns undefined if it's an incompatible type assignment.
   * @param {? (any) => boolean} isTypeCoercible A function that type checks a value and returns true if it's of the correct type or coercible to the correct type, or false if it's the wrong type.
   * @param {T[]} initArray Make the Array a constant size.
   * @param {boolean} seal Make the Array a constant size. initArray must be set.
   * @param {boolean} freeze Make the Array immutable. initArray must be set.
   */
  constructor({ type, typeCoercer, isTypeCoercible, initArray, seal, freeze }: { type: T | typeofTypes, typeCoercer?: (_: any) => T | undefined, isTypeCoercible?: (arg0: any) => boolean, initArray?: T[], seal?: boolean, freeze?: boolean }){
    this.#type = type
    if (typeof typeCoercer === "function") this.#typeCoerce = typeCoercer 
    if (typeof isTypeCoercible === "function") this.#isTypeCoercible = isTypeCoercible
    if (Array.isArray(initArray)) {
      this.#array = initArray
       .filter(v => this.#isTypeCoercible(v))
       .map(coercibleV => (this.#typeCoerce(coercibleV) as T))
      // static Array size:
      if (seal) Object.seal(this.#array)
      // static Array size and elements:
      if (freeze) Object.freeze(this.#array)
    }
  }

  get length(){
    return this.#array.length
  }

  get isType(){
    return this.#isTypeCoercible
  }

  get check(){
    return this.#typeCoerce
  }

  get type(){
    return this.#type
  }
  /**
   * @param {number} index The index to get from the internal statically typed array.
   * @returns The value of the index in the internal statically typed array.
   */
  get(index: number){
    return this.#array[index]
  }
  /**
   * @param {number} index The index to set in the internal statically typed array.
   * @param {T} value The value to insert into the internal statically typed array. Should be coercible by the type coercing function.
   * @returns {T | undefined} Returns the value given, or undefined if the type was incorrect.
   */
  set(index: number, value: T){
    const valueT = this.#typeCoerce(value)
    if (valueT) return this.#array[index] = valueT
    return undefined
  }
  /**
   * @returns The internal statically typed array as a standard Array.
   */
  getArray(){
    return this.#array.slice()
  }
  get array(){
    return this.#array.slice()
  }
  /**
   * Changes all array elements from start to end index to a static value and returns the modified array
   * @param {T} value value to fill array section with
   * @param {?number} start index to start filling the array at. If start is negative, it is treated as length+start where length is the length of the array.
   * @param {?number} end index to stop filling the array at. If end is negative, it is treated as length+end.
   * @returns {T[] | undefined} The modified array, or undefined if the type was incorrect. 
   */
  fill(value: T, start?: number, end?: number) {
    const valueT = this.#typeCoerce(value)
    if (valueT) return this.#array.fill(valueT, start, end)
  }
  /**
   * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
   * @param {number} start The zero-based location in the array from which to start removing elements.
   * @param {?number} deleteCount The number of elements to remove.
   * @param {...T[]} items Elements to insert into the array in place of the deleted elements. Must be coercible to the correct type, or they won't be added in place of the old elements.
   * @returns An array containing the elements that were deleted.
   */
  splice(start: number, deleteCount?: number, ...items: T[]) {
    const itemsT = items
     .filter(v => this.#isTypeCoercible(v))
     .map(coercibleV => (this.#typeCoerce(coercibleV) as T))
    if (itemsT.length > 0 && deleteCount) return this.#array.splice(start, deleteCount, ...itemsT)
    if (deleteCount) return this.#array.splice(start, deleteCount)
  }
  /**
   * Appends new elements to the end of an array, and returns the new length of the array.
   * @param {T[]} items New elements to add to the array.
   * @returns {number} The new length of the array.
   */
  push(...items: T[]) {
    const itemsT = items
     .filter(v => this.#isTypeCoercible(v))
     .map(coercibleV => (this.#typeCoerce(coercibleV) as T))
    if (itemsT.length > 0) return this.#array.push(...itemsT)
  }

  // non-type-mutating functions that don't require reimplementation:
  at = this.#array.at.bind(this.#array)
  concat = this.#array.concat.bind(this.#array)
  copyWithin = this.#array.copyWithin.bind(this.#array)
  entries = this.#array.entries.bind(this.#array)
  every = this.#array.every.bind(this.#array)
  filter = this.#array.filter.bind(this.#array)
  find = this.#array.find.bind(this.#array)
  findIndex = this.#array.findIndex.bind(this.#array)
  flat = this.#array.flat.bind(this.#array)
  flatMap = this.#array.flatMap.bind(this.#array)
  forEach = this.#array.forEach.bind(this.#array)
  includes = this.#array.includes.bind(this.#array)
  indexOf = this.#array.indexOf.bind(this.#array)
  join = this.#array.join.bind(this.#array)
  keys = this.#array.keys.bind(this.#array)
  lastIndexOf = this.#array.lastIndexOf.bind(this.#array)
  map = this.#array.map.bind(this.#array)
  pop = this.#array.pop.bind(this.#array)
  reduce = this.#array.reduce.bind(this.#array)
  reduceRight = this.#array.reduceRight.bind(this.#array)
  reverse = this.#array.reverse.bind(this.#array)
  shift = this.#array.shift.bind(this.#array)
  slice = this.#array.slice.bind(this.#array)
  some = this.#array.some.bind(this.#array)
  sort = this.#array.sort.bind(this.#array)
  toLocaleString = this.#array.toLocaleString.bind(this.#array)
  toString = this.#array.toString.bind(this.#array)
  values = this.#array.values.bind(this.#array)
}

export class PCPartSearchURI {
  // private class members to ensure type saftey:
  #idFilter: ArrayWithTypes<string> = new ArrayWithTypes<string>({ type: "string" })
  #oemFilter: ArrayWithTypes<string> = new ArrayWithTypes<string>({ type: "string" })
  #typeFilter: ArrayWithTypes<PCPartType> = new ArrayWithTypes<PCPartType>({
    type: (PCPartType as unknown as PCPartType),
    // @ts-ignore This is valid for enums in the emited JS Object.hasOwn will return only the enum values:
    typeCoercer: (v) => (typeof v === "string" && Object.hasOwn(PCPartType, v)) ? PCPartType[v] : undefined,
    isTypeCoercible: (v) => (typeof v === "string" && Object.hasOwn(PCPartType, v)) ? true : false
  })
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

    console.log("> PCPartSearchURI~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    console.log("this")
    console.dir(this)
    console.log("config")
    console.dir(config)
  }
  
  set minPriceFilter(newValue: Big | string | undefined){
    if (newValue === undefined) this.#minPriceFilter = newValue
    if (newValue) this.#minPriceFilter = Big(newValue)
  }
  get minPriceFilter(): Big | undefined {
    return this.#minPriceFilter
  }
  
  set maxPriceFilter(newValue: Big | string | undefined){
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

    console.log("> toURI()","query",query,"params",params)
    
    return query
  }

  toString(){
    const queryString = this.toURI().toString()

    console.log("> toString()","queryString",queryString)

    return queryString
  }
}

export const filterDB = (data: PCPartInfo[], query: qs.ParsedQs | PCPartSearchParamsState | Record<string, string | string[]> | Record<string, any>): PCPartInfo[] => {
  const params = new PCPartSearchURI({
    ...query,
    ids: ((query as any).id ?? query.ids as any),
    oems: ((query as any).oem ?? query.oems as any),
    types: ((query as any).type ?? query.types as any),
  })
  
  let res: PCPartInfo[] = data.slice()

  // get only by id:
  if (params.filterIDs.array.length > 0) res = res.filter(({ id }) => params.filterIDs.array.includes(id))
  else {
    // get by type:
    if (params.filterTypes.length > 0) res = res.filter(({ type }) => params.filterTypes.includes(type))
    
    // get by manufacturer:
    if (params.filterOEMs.length > 0) res = res.filter(({ manufacturer }) => params.filterOEMs.includes(manufacturer as string))
    
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