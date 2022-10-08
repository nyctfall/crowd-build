"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDB = exports.PCPartSearchURI = exports.PCPartType = void 0;
const big_js_1 = __importDefault(require("big.js"));
var PCPartType;
(function (PCPartType) {
    PCPartType["CPU"] = "CPU";
    PCPartType["GPU"] = "GPU";
    PCPartType["RAM"] = "RAM";
    PCPartType["Cooler"] = "Cooler";
    PCPartType["Motherboard"] = "Motherboard";
    PCPartType["SSD"] = "SSD";
    PCPartType["HDD"] = "HDD";
    PCPartType["SSHD"] = "SSHD";
    PCPartType["PSU"] = "PSU";
    PCPartType["Case"] = "Case";
})(PCPartType = exports.PCPartType || (exports.PCPartType = {}));
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
        if (deleteCount)
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
class PCPartSearchURI {
    #idFilter = new ArrayWithTypes({ type: "string" });
    #oemFilter = new ArrayWithTypes({ type: "string" });
    #typeFilter = new ArrayWithTypes({
        type: PCPartType,
        typeCoercer: (v) => (typeof v === "string" && Object.hasOwn(PCPartType, v)) ? PCPartType[v] : undefined,
        isTypeCoercible: (v) => (typeof v === "string" && Object.hasOwn(PCPartType, v)) ? true : false
    });
    #maxPriceFilter;
    #minPriceFilter;
    constructor(config = {}) {
        if (Array.isArray(config.ids))
            this.#idFilter.push(...config.ids);
        else
            this.#idFilter.push(config.ids);
        if (Array.isArray(config.types))
            this.#typeFilter.push(...config.types);
        else
            this.#typeFilter.push(config.types);
        if (Array.isArray(config.oems))
            this.#oemFilter.push(...config.oems);
        else
            this.#oemFilter.push(config.oems);
        if (config.minPrice)
            this.minPriceFilter = config.minPrice;
        if (config.maxPrice)
            this.maxPriceFilter = config.maxPrice;
        console.log("> PCPartSearchURI~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        console.log("this");
        console.dir(this);
        console.log("config");
        console.dir(config);
    }
    set minPriceFilter(newValue) {
        if (newValue === undefined)
            this.#minPriceFilter = newValue;
        if (newValue)
            this.#minPriceFilter = (0, big_js_1.default)(newValue);
    }
    get minPriceFilter() {
        return this.#minPriceFilter;
    }
    set maxPriceFilter(newValue) {
        if (newValue === undefined)
            this.#maxPriceFilter = newValue;
        if (newValue)
            this.#maxPriceFilter = (0, big_js_1.default)(newValue);
    }
    get maxPriceFilter() {
        return this.#maxPriceFilter;
    }
    get filterIDs() {
        return this.#idFilter;
    }
    get filterTypes() {
        return this.#typeFilter;
    }
    get filterOEMs() {
        return this.#oemFilter;
    }
    toURI() {
        const params = [];
        if (this.#maxPriceFilter)
            params.push(["maxPrice", this.#maxPriceFilter.toString()]);
        if (this.#minPriceFilter)
            params.push(["minPrice", this.#minPriceFilter.toString()]);
        if (this.#idFilter.length > 0)
            this.#idFilter.forEach(id => params.push(["ids", id]));
        if (this.#typeFilter.length > 0)
            this.#typeFilter.forEach(type => params.push(["types", type]));
        if (this.#oemFilter.length > 0)
            this.#oemFilter.forEach(oem => params.push(["oems", oem]));
        const query = new URLSearchParams(params);
        console.log("> toURI()", "query", query, "params", params);
        return query;
    }
    toString() {
        const queryString = this.toURI().toString();
        console.log("> toString()", "queryString", queryString);
        return queryString;
    }
}
exports.PCPartSearchURI = PCPartSearchURI;
const filterDB = (data, query) => {
    const params = new PCPartSearchURI({
        ...query,
        ids: (query.id ?? query.ids),
        oems: (query.oem ?? query.oems),
        types: (query.type ?? query.types),
    });
    let res = data.slice();
    if (params.filterIDs.array.length > 0)
        res = res.filter(({ id }) => params.filterIDs.array.includes(id));
    else {
        if (params.filterTypes.length > 0)
            res = res.filter(({ type }) => params.filterTypes.includes(type));
        if (params.filterOEMs.length > 0)
            res = res.filter(({ manufacturer }) => params.filterOEMs.includes(manufacturer));
        if (params.minPriceFilter instanceof big_js_1.default || params.maxPriceFilter instanceof big_js_1.default) {
            if (params.minPriceFilter instanceof big_js_1.default)
                res = res.filter(({ MSRP }) => params.minPriceFilter?.lte(MSRP));
            if (params.maxPriceFilter instanceof big_js_1.default)
                res = res.filter(({ MSRP }) => params.maxPriceFilter?.gte(MSRP));
            if (params.minPriceFilter instanceof big_js_1.default && params.maxPriceFilter instanceof big_js_1.default)
                res = res.filter(({ MSRP }) => params.minPriceFilter?.lte(MSRP) && params.maxPriceFilter?.gte(MSRP));
        }
    }
    return res;
};
exports.filterDB = filterDB;
//# sourceMappingURL=api.js.map