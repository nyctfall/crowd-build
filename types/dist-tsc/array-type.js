"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayTypeSafeProxy = exports.ArrayTypeSafeMethods = exports.ArrayWithTypes = void 0;
class ArrayWithTypes {
    #array = [];
    #type;
    #isTypeCoercible = (arg) => {
        if ((typeof this.#type === "string" && typeof arg === this.#type) || (this.#type && typeof this.#type === "object" && (typeof this.#type[Symbol.hasInstance] === "function" || typeof this.#type === "function") && arg instanceof this.#type))
            return true;
        return false;
    };
    #typeCoerce = (arg) => {
        if (this.#isTypeCoercible(arg))
            return arg;
    };
    constructor({ type, typeCoercer, isTypeCoercible, initArray, seal, freeze }) {
        this.#type = type;
        if (typeof typeCoercer === "function")
            this.#typeCoerce = typeCoercer;
        if (typeof isTypeCoercible === "function")
            this.#isTypeCoercible = isTypeCoercible;
        if (Array.isArray(initArray)) {
            this.#array = initArray
                .filter(v => this.#isTypeCoercible(v))
                .map(coercibleV => this.#typeCoerce(coercibleV));
            if (seal)
                Object.seal(this.#array);
            if (freeze)
                Object.freeze(this.#array);
        }
    }
    get length() {
        return this.#array.length;
    }
    get isType() {
        return this.#isTypeCoercible;
    }
    get check() {
        return this.#typeCoerce;
    }
    get type() {
        return this.#type;
    }
    get(index) {
        return this.#array[index];
    }
    set(index, value) {
        const valueT = this.#typeCoerce(value);
        if (valueT)
            return this.#array[index] = valueT;
        return undefined;
    }
    getArray() {
        return this.#array.slice();
    }
    get array() {
        return this.#array.slice();
    }
    fill(value, start, end) {
        const valueT = this.#typeCoerce(value);
        if (valueT)
            return this.#array.fill(valueT, start, end);
    }
    splice(start, deleteCount, ...items) {
        const itemsT = items
            .filter(v => this.#isTypeCoercible(v))
            .map(coercibleV => this.#typeCoerce(coercibleV));
        if (itemsT.length > 0 && deleteCount)
            return this.#array.splice(start, deleteCount, ...itemsT);
        return this.#array.splice(start, deleteCount);
    }
    push(...items) {
        const itemsT = items
            .filter(v => this.#isTypeCoercible(v))
            .map(coercibleV => this.#typeCoerce(coercibleV));
        if (itemsT.length > 0)
            return this.#array.push(...itemsT);
    }
    at = this.#array.at.bind(this.#array);
    concat = this.#array.concat.bind(this.#array);
    copyWithin = this.#array.copyWithin.bind(this.#array);
    entries = this.#array.entries.bind(this.#array);
    every = this.#array.every.bind(this.#array);
    filter = this.#array.filter.bind(this.#array);
    find = this.#array.find.bind(this.#array);
    findIndex = this.#array.findIndex.bind(this.#array);
    flat = this.#array.flat.bind(this.#array);
    flatMap = this.#array.flatMap.bind(this.#array);
    forEach = this.#array.forEach.bind(this.#array);
    includes = this.#array.includes.bind(this.#array);
    indexOf = this.#array.indexOf.bind(this.#array);
    join = this.#array.join.bind(this.#array);
    keys = this.#array.keys.bind(this.#array);
    lastIndexOf = this.#array.lastIndexOf.bind(this.#array);
    map = this.#array.map.bind(this.#array);
    pop = this.#array.pop.bind(this.#array);
    reduce = this.#array.reduce.bind(this.#array);
    reduceRight = this.#array.reduceRight.bind(this.#array);
    reverse = this.#array.reverse.bind(this.#array);
    shift = this.#array.shift.bind(this.#array);
    slice = this.#array.slice.bind(this.#array);
    some = this.#array.some.bind(this.#array);
    sort = this.#array.sort.bind(this.#array);
    toLocaleString = this.#array.toLocaleString.bind(this.#array);
    toString = this.#array.toString.bind(this.#array);
    values = this.#array.values.bind(this.#array);
}
exports.ArrayWithTypes = ArrayWithTypes;
class ArrayTypeSafeMethods extends Array {
    static get [Symbol.species]() {
        return Array;
    }
    #type;
    #verifier = (arg) => {
        if ((typeof this.#type === "string" && typeof arg === this.#type) || (this.#type && typeof this.#type === "object" && (typeof this.#type[Symbol.hasInstance] === "function" || typeof this.#type === "function") && arg instanceof this.#type))
            return true;
        return false;
    };
    #coercer = (arg) => {
        if (this.#verifier(arg))
            return arg;
    };
    constructor({ type, coercer, verifier, initArray, seal, freeze }) {
        super();
        this.#type = type;
        if (typeof coercer === "function")
            this.#coercer = coercer;
        if (typeof verifier === "function")
            this.#verifier = verifier;
        if (Array.isArray(initArray)) {
            this.push(...initArray
                .filter(v => this.#verifier(v))
                .map(coercibleV => this.#coercer(coercibleV)));
            if (seal)
                Object.seal(this);
            if (freeze)
                Object.freeze(this);
        }
    }
    get verifier() {
        return this.#verifier;
    }
    get coercer() {
        return this.#coercer;
    }
    get type() {
        return this.#type;
    }
    toArray() {
        return this.slice();
    }
    get array() {
        return this.slice();
    }
    fill(value, start, end) {
        const valueT = this.#coercer(value);
        if (valueT)
            return super.fill(valueT, start, end);
        return this;
    }
    splice(start, deleteCount, ...items) {
        const itemsT = items
            .filter(v => this.#verifier(v))
            .map(coercibleV => this.#coercer(coercibleV));
        if (itemsT.length > 0 && deleteCount)
            return super.splice(start, deleteCount, ...itemsT);
        return super.splice(start, deleteCount);
    }
    push(...items) {
        const itemsT = items
            .filter(v => this.#verifier(v))
            .map(coercibleV => this.#coercer(coercibleV));
        if (itemsT.length > 0)
            return super.push(...itemsT);
        return NaN;
    }
}
exports.ArrayTypeSafeMethods = ArrayTypeSafeMethods;
function ArrayTypeSafeProxy(config) {
    const internalArray = new ArrayTypeSafeMethods(config);
    return new Proxy(internalArray, {
        set(target, property, value, receiver) {
            if (typeof property !== "string" || (property.match(/^[1-9]\d*$|^0$/) && internalArray.verifier(value)))
                return Reflect.set(target, property, internalArray.coercer(value), receiver);
            return true;
        },
        get(target, property, receiver) {
            const value = target[property];
            if (value instanceof Function)
                return function (...args) {
                    return value.apply((this === receiver ? target : this), args);
                };
            return value;
        }
    });
}
exports.ArrayTypeSafeProxy = ArrayTypeSafeProxy;
//# sourceMappingURL=array-type.js.map