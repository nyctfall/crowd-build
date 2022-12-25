"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageAvailable = exports.filterDB = exports.PCPartSearchURI = exports.typeFilterBuilder = exports.oemFilterBuilder = exports.idFilterBuilder = exports.PCPartType = exports.HTTPStatusCode = exports.dbgLog = void 0;
const big_js_1 = __importDefault(require("big.js"));
const array_type_1 = require("./array-type");
const logger_1 = require("./logger");
Object.defineProperty(exports, "dbgLog", { enumerable: true, get: function () { return logger_1.dbgLog; } });
__exportStar(require("./logger"), exports);
const log = logger_1.dbgLog.fileLogger("api.ts");
var HTTPStatusCode;
(function (HTTPStatusCode) {
    HTTPStatusCode[HTTPStatusCode["Continue"] = 100] = "Continue";
    HTTPStatusCode[HTTPStatusCode["Switching Protocols"] = 101] = "Switching Protocols";
    HTTPStatusCode[HTTPStatusCode["Processing"] = 102] = "Processing";
    HTTPStatusCode[HTTPStatusCode["Early Hints"] = 103] = "Early Hints";
    HTTPStatusCode[HTTPStatusCode["OK"] = 200] = "OK";
    HTTPStatusCode[HTTPStatusCode["Created"] = 201] = "Created";
    HTTPStatusCode[HTTPStatusCode["Accepted"] = 202] = "Accepted";
    HTTPStatusCode[HTTPStatusCode["Non-Authoritative Information"] = 203] = "Non-Authoritative Information";
    HTTPStatusCode[HTTPStatusCode["No Content"] = 204] = "No Content";
    HTTPStatusCode[HTTPStatusCode["Reset Content"] = 205] = "Reset Content";
    HTTPStatusCode[HTTPStatusCode["Partial Content"] = 206] = "Partial Content";
    HTTPStatusCode[HTTPStatusCode["Multi-Status"] = 207] = "Multi-Status";
    HTTPStatusCode[HTTPStatusCode["Already Reported"] = 208] = "Already Reported";
    HTTPStatusCode[HTTPStatusCode["IM Used"] = 226] = "IM Used";
    HTTPStatusCode[HTTPStatusCode["Multiple Choices"] = 300] = "Multiple Choices";
    HTTPStatusCode[HTTPStatusCode["Moved Permanently"] = 301] = "Moved Permanently";
    HTTPStatusCode[HTTPStatusCode["Found"] = 302] = "Found";
    HTTPStatusCode[HTTPStatusCode["See Other"] = 303] = "See Other";
    HTTPStatusCode[HTTPStatusCode["Not Modified"] = 304] = "Not Modified";
    HTTPStatusCode[HTTPStatusCode["Use Proxy"] = 305] = "Use Proxy";
    HTTPStatusCode[HTTPStatusCode["unused"] = 306] = "unused";
    HTTPStatusCode[HTTPStatusCode["Temporary Redirect"] = 307] = "Temporary Redirect";
    HTTPStatusCode[HTTPStatusCode["Permanent Redirect"] = 308] = "Permanent Redirect";
    HTTPStatusCode[HTTPStatusCode["Bad Request"] = 400] = "Bad Request";
    HTTPStatusCode[HTTPStatusCode["Unauthorized"] = 401] = "Unauthorized";
    HTTPStatusCode[HTTPStatusCode["Payment Required"] = 402] = "Payment Required";
    HTTPStatusCode[HTTPStatusCode["Forbidden"] = 403] = "Forbidden";
    HTTPStatusCode[HTTPStatusCode["Not Found"] = 404] = "Not Found";
    HTTPStatusCode[HTTPStatusCode["Method Not Allowed"] = 405] = "Method Not Allowed";
    HTTPStatusCode[HTTPStatusCode["Not Acceptable"] = 406] = "Not Acceptable";
    HTTPStatusCode[HTTPStatusCode["Proxy Authentication Required"] = 407] = "Proxy Authentication Required";
    HTTPStatusCode[HTTPStatusCode["Request Timeout"] = 408] = "Request Timeout";
    HTTPStatusCode[HTTPStatusCode["Conflict"] = 409] = "Conflict";
    HTTPStatusCode[HTTPStatusCode["Gone"] = 410] = "Gone";
    HTTPStatusCode[HTTPStatusCode["Length Required"] = 411] = "Length Required";
    HTTPStatusCode[HTTPStatusCode["Precondition Failed"] = 412] = "Precondition Failed";
    HTTPStatusCode[HTTPStatusCode["Payload Too Large"] = 413] = "Payload Too Large";
    HTTPStatusCode[HTTPStatusCode["URI Too Long"] = 414] = "URI Too Long";
    HTTPStatusCode[HTTPStatusCode["Unsupported Media Type"] = 415] = "Unsupported Media Type";
    HTTPStatusCode[HTTPStatusCode["Range Not Satisfiable"] = 416] = "Range Not Satisfiable";
    HTTPStatusCode[HTTPStatusCode["Expectation Failed"] = 417] = "Expectation Failed";
    HTTPStatusCode[HTTPStatusCode["I'm a teapot"] = 418] = "I'm a teapot";
    HTTPStatusCode[HTTPStatusCode["Misdirected Request"] = 421] = "Misdirected Request";
    HTTPStatusCode[HTTPStatusCode["Unprocessable Entity"] = 422] = "Unprocessable Entity";
    HTTPStatusCode[HTTPStatusCode["Locked"] = 423] = "Locked";
    HTTPStatusCode[HTTPStatusCode["Failed Dependency"] = 424] = "Failed Dependency";
    HTTPStatusCode[HTTPStatusCode["Too Early"] = 425] = "Too Early";
    HTTPStatusCode[HTTPStatusCode["Upgrade Required"] = 426] = "Upgrade Required";
    HTTPStatusCode[HTTPStatusCode["Precondition Required"] = 428] = "Precondition Required";
    HTTPStatusCode[HTTPStatusCode["Too Many Requests"] = 429] = "Too Many Requests";
    HTTPStatusCode[HTTPStatusCode["Request Header Fields Too Large"] = 431] = "Request Header Fields Too Large";
    HTTPStatusCode[HTTPStatusCode["Unavailable For Legal Reasons"] = 451] = "Unavailable For Legal Reasons";
    HTTPStatusCode[HTTPStatusCode["Internal Server Error"] = 500] = "Internal Server Error";
    HTTPStatusCode[HTTPStatusCode["Not Implemented"] = 501] = "Not Implemented";
    HTTPStatusCode[HTTPStatusCode["Bad Gateway"] = 502] = "Bad Gateway";
    HTTPStatusCode[HTTPStatusCode["Service Unavailable"] = 503] = "Service Unavailable";
    HTTPStatusCode[HTTPStatusCode["Gateway Timeout"] = 504] = "Gateway Timeout";
    HTTPStatusCode[HTTPStatusCode["HTTP Version Not Supported"] = 505] = "HTTP Version Not Supported";
    HTTPStatusCode[HTTPStatusCode["Variant Also Negotiates"] = 506] = "Variant Also Negotiates";
    HTTPStatusCode[HTTPStatusCode["Insufficient Storage"] = 507] = "Insufficient Storage";
    HTTPStatusCode[HTTPStatusCode["Loop Detected"] = 508] = "Loop Detected";
    HTTPStatusCode[HTTPStatusCode["Not Extended"] = 510] = "Not Extended";
    HTTPStatusCode[HTTPStatusCode["Network Authentication Required"] = 511] = "Network Authentication Required";
})(HTTPStatusCode = exports.HTTPStatusCode || (exports.HTTPStatusCode = {}));
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
    typeCoercer: v => (typeof v === "string" && Object.hasOwn(PCPartType, v) ? PCPartType[v] : undefined),
    isTypeCoercible: v => (typeof v === "string" && Object.hasOwn(PCPartType, v) ? true : false)
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
        log(["class PCPartSearchURI", "constructor"], "this", this, "config", config);
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
        log(["class PCPartSearchURI", "toURI"], "query", query, "params", params);
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
        log(["class PCPartSearchURI", "toURI"], "query", query, "params", params, "this", this);
        return query;
    }
    toString() {
        const queryString = this.toURI().toString();
        log(["class PCPartSearchURI", "toString"], "queryString", queryString, "this", this);
        return queryString;
    }
}
exports.PCPartSearchURI = PCPartSearchURI;
const filterDB = (data, query) => {
    const params = new PCPartSearchURI({
        ...query,
        ids: query.id ?? query.ids,
        oems: query.oem ?? query.oems,
        types: query.type ?? query.types
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
const storageAvailable = (type) => {
    let storage;
    try {
        storage = window[type];
        const x = "__storage_test__";
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return (e instanceof DOMException &&
            (e.code === 22 ||
                e.code === 1014 ||
                e.name === "QuotaExceededError" ||
                e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
            storage &&
            storage.length !== 0);
    }
};
exports.storageAvailable = storageAvailable;
//# sourceMappingURL=api.js.map