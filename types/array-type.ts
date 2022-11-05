type typeofTypes = "undefined" | "object" | "boolean" | "number" | "bigint" | "string" | "symbol" | "function"

export interface ArrayWithTypesOpts<T> { 
  type: T | typeofTypes
  typeCoercer?: (arg0: any) => T | undefined
  isTypeCoercible?: (arg0: any) => boolean
  initArray?: T[]
  seal?: boolean
  freeze?: boolean
}

export class ArrayWithTypes<T> {
  // private class members to ensure type saftey:
  readonly #array: T[] = []
  readonly #type: T | string
  readonly #isTypeCoercible = (arg: any): boolean => {
    if ((typeof this.#type === "string" && typeof arg === this.#type) || (this.#type && typeof this.#type === "object" && (typeof (this.#type as any)[Symbol.hasInstance] === "function" || typeof this.#type === "function") && arg instanceof (this.#type as any))) return true
    return false
  }
  readonly #typeCoerce = (arg: any): T | undefined => {
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
  constructor({ type, typeCoercer, isTypeCoercible, initArray, seal, freeze }: ArrayWithTypesOpts<T>){
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
    return this.#array.splice(start, deleteCount)
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


/** @todo Proxy to Array sub class: */
export interface ArrayTypeConfig<T> { 
  type: T | typeofTypes
  coercer?: (arg0: any) => T | undefined
  verifier?: (arg0: any) => boolean
  initArray?: T[]
  seal?: boolean
  freeze?: boolean
}

export class ArrayTypeSafeMethods<T> extends Array<T> {
  // so methods like .map() return a normal Array:
  static get [Symbol.species](){
    return Array
  }

  // private class members to ensure type saftey:
  readonly #type: T | typeofTypes
  readonly #verifier = (arg: any): boolean => {
    if ((typeof this.#type === "string" && typeof arg === this.#type) || (this.#type && typeof this.#type === "object" && (typeof (this.#type as any)[Symbol.hasInstance] === "function" || typeof this.#type === "function") && arg instanceof (this.#type as any))) return true
    return false
  }

  readonly #coercer = (arg: any): T | undefined => {
    if (this.#verifier(arg)) return arg
  }

  /**
   * @typedef {"undefined" | "object" | "boolean" | "number" | "bigint" | "string" | "symbol" | "function"} typeofTypes 
   * @param {T | typeofTypes} config.type The type of the value when comparing with typeof or instanceof operators.
   * @param {? (any) => T | undefined} config.coercer A function that type checks a value, (and possibly coerces it), or returns undefined if it's an incompatible type assignment.
   * @param {? (any) => boolean} config.verifier A function that type checks a value and returns true if it's of the correct type or coercible to the correct type, or false if it's the wrong type.
   * @param {T[]} config.initArray Make the Array a constant size.
   * @param {boolean} config.seal Make the Array a constant size. initArray must be set.
   * @param {boolean} config.freeze Make the Array immutable. initArray must be set.
   */
  constructor({ type, coercer, verifier, initArray, seal, freeze }: ArrayTypeConfig<T>){
    super()

    this.#type = type
    if (typeof coercer === "function") this.#coercer = coercer 
    if (typeof verifier === "function") this.#verifier = verifier
    if (Array.isArray(initArray)){
      this.push(...initArray
        .filter(v => this.#verifier(v))
        .map(coercibleV => this.#coercer(coercibleV) as T)
      )
      // static Array size:
      if (seal) Object.seal(this)
      // static Array size and elements:
      if (freeze) Object.freeze(this)
    }
  }

  // getters to prevent mutation:
  get verifier(){
    return this.#verifier
  }

  get coercer(){
    return this.#coercer
  }

  get type(){
    return this.#type
  }

  /** @returns The statically typed array as a standard Array. */
  toArray(){
    return this.slice()
  }

  /** @summary The statically typed array as a standard Array. */
  get array(){
    return this.slice()
  }

  /**
   * Changes all array elements from start to end index to a static value and returns the modified array
   * @param {T} value value to fill array section with
   * @param {?number} start index to start filling the array at. If start is negative, it is treated as length+start where length is the length of the array.
   * @param {?number} end index to stop filling the array at. If end is negative, it is treated as length+end.
   * @returns {T[]} The modified array, or the unmodified array if the type was incorrect. 
   */
  fill(value: T, start?: number, end?: number){
    const valueT = this.#coercer(value)
    if (valueT) return super.fill(valueT, start, end)
    return this
  }

  /**
   * Removes elements from an array and, if necessary, inserts new elements in their place, returning the deleted elements.
   * @param {number} start The zero-based location in the array from which to start removing elements.
   * @param {?number} deleteCount The number of elements to remove.
   * @param {...T[]} items Elements to insert into the array in place of the deleted elements. Must be coercible to the correct type, or they won't be added in place of the old elements.
   * @returns An array containing the elements that were deleted.
   */
  splice(start: number, deleteCount?: number, ...items: T[]){
    const itemsT = items
     .filter(v => this.#verifier(v))
     .map(coercibleV => (this.#coercer(coercibleV) as T))
    if (itemsT.length > 0 && deleteCount) return super.splice(start, deleteCount, ...itemsT)
    return super.splice(start, deleteCount)
  }
  
  /**
   * Appends new elements to the end of an array, and returns the new length of the array.
   * @param {T[]} items New elements to add to the array. Must be coercible to type T or they won't be added to the array.
   * @returns {number|NaN} The new length of the array, or NaN if the wrong type was used.
   */
  push(...items: T[]){
    const itemsT = items
     .filter(v => this.#verifier(v))
     .map(coercibleV => (this.#coercer(coercibleV) as T))
    if (itemsT.length > 0) return super.push(...itemsT)
    return NaN
  }
}

export function ArrayTypeSafeProxy<T> (config: ArrayTypeConfig<T>){
    const internalArray = new ArrayTypeSafeMethods<T>(config)
    
    return new Proxy<ArrayTypeSafeMethods<T>>(internalArray, {
      set(target: ArrayTypeSafeMethods<T>, property: (string | symbol) & keyof ArrayTypeSafeMethods<T>, value: ArrayTypeSafeMethods<T>[keyof ArrayTypeSafeMethods<T>], receiver: any): boolean {
        // check if index assignment, a string representation of a non-negative integer, /^0$/ or /^[1-9][0-9]*$/
        // and coerce to type T if it's an index:
        if (typeof property !== "string" || (property.match(/^[1-9]\d*$|^0$/) && internalArray.verifier(value))) return Reflect.set(target, property, internalArray.coercer(value), receiver)
        
        // must always return true, or it will throw a TypeError in "strict mode" and modules:
        return true
      },
      get(target: ArrayTypeSafeMethods<T>, property: (string | symbol) & keyof ArrayTypeSafeMethods<T>, receiver: any): ArrayTypeSafeMethods<T>[keyof ArrayTypeSafeMethods<T>] {
        const value = target[property]
        
        // apply used to bind this to the correct object, and allow access to private class fields and internal slots,
        // do not use arrow function because the this value is bound lexically, that is not the case with function delarations:
        if (value instanceof Function) return function(this: any, ...args: any[]): any {
          return (value as Function).apply((this === receiver ? target : this) as ArrayTypeSafeMethods<T>, args)
        }
        
        return value
      }
    })
  }
