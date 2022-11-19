"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterDB = exports.PCPartSearchURI = exports.typeFilterBuilder = exports.oemFilterBuilder = exports.idFilterBuilder = exports.PCPartType = exports.dbgLog = void 0;
const big_js_1 = __importDefault(require("big.js"));
const array_type_1 = require("./array-type");
const dbgLog = (file, trace, ...logs) => {
    try {
        console.log(`${"-".repeat(8)}${file}${"-".repeat(8)}\n`, `> ${[trace].flat(1).map(str => str.endsWith(")") ? str : `${str}()`).join(" > ")}:\n`, ...logs.map((varNameOrVal, index) => index % 2 === 1 ?
            varNameOrVal
            : `${varNameOrVal?.startsWith?.("\n") ? "" : "\n"}${varNameOrVal}${varNameOrVal?.endsWith?.(":") ? "" : ":"}`));
    }
    catch (e) {
        console.error(e);
    }
};
exports.dbgLog = dbgLog;
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
const idFilterBuilder = (opts) => new array_type_1.ArrayWithTypes({ ...opts, type: "string" });
exports.idFilterBuilder = idFilterBuilder;
const oemFilterBuilder = (opts) => new array_type_1.ArrayWithTypes({ ...opts, type: "string" });
exports.oemFilterBuilder = oemFilterBuilder;
const typeFilterBuilder = (opts) => new array_type_1.ArrayWithTypes({
    ...opts,
    type: PCPartType,
    typeCoercer: (v) => (typeof v === "string" && Object.hasOwn(PCPartType, v)) ? PCPartType[v] : undefined,
    isTypeCoercible: (v) => (typeof v === "string" && Object.hasOwn(PCPartType, v)) ? true : false
});
exports.typeFilterBuilder = typeFilterBuilder;
class PCPartSearchURI {
    #idFilter = (0, exports.idFilterBuilder)();
    #oemFilter = (0, exports.oemFilterBuilder)();
    #typeFilter = (0, exports.typeFilterBuilder)();
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
        (0, exports.dbgLog)("api.ts", ["class PCPartSearchURI", "constructor"], "this", this, "config", config);
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
        (0, exports.dbgLog)("api.ts", ["class PCPartSearchURI", "toURI"], "query", query, "params", params);
        return query;
    }
    toURIEncoded() {
        const params = [];
        if (this.#maxPriceFilter)
            params.push(["maxPrice", encodeURIComponent(this.#maxPriceFilter.toString())]);
        if (this.#minPriceFilter)
            params.push(["minPrice", encodeURIComponent(this.#minPriceFilter.toString())]);
        if (this.#idFilter.length > 0)
            this.#idFilter.forEach(id => params.push(["ids", encodeURIComponent(id)]));
        if (this.#typeFilter.length > 0)
            this.#typeFilter.forEach(type => params.push(["types", encodeURIComponent(type)]));
        if (this.#oemFilter.length > 0)
            this.#oemFilter.forEach(oem => params.push(["oems", encodeURIComponent(oem)]));
        const query = new URLSearchParams(params);
        (0, exports.dbgLog)("api.ts", ["class PCPartSearchURI", "toURI"], "query", query, "params", params, "this", this);
        return query;
    }
    toString() {
        const queryString = this.toURI().toString();
        (0, exports.dbgLog)("api.ts", ["class PCPartSearchURI", "toString"], "queryString", queryString, "this", this);
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
        res = res.filter(({ _id }) => params.filterIDs.array.includes(_id));
    else {
        if (params.filterTypes.length > 0)
            res = res.filter(({ type }) => params.filterTypes.includes(type));
        if (params.filterOEMs.length > 0)
            res = res.filter(({ oem }) => params.filterOEMs.includes(oem));
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