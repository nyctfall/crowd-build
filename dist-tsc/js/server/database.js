"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const big_js_1 = __importDefault(require("big.js"));
const api_1 = require("../types/api");
const api_2 = require("../types/api");
const testData = [
    {
        "id": "1",
        "name": "AMD Ryzen 9 5950X",
        "manufacturer": "AMD",
        "model": "Ryzen 9 5950X",
        "released": "11/5/2020",
        "MSRP": 799,
        "type": api_2.PCPartType["CPU"],
        "typeInfo": {
            "Codename": "Vermeer",
            "Cores": 16,
            "Treads": 32,
            "Max Boost Clock": "4.95GHz",
            "Base Clock": "3.4GHz",
            "L2 Cache": "8MB",
            "L3 Cache": "64MB",
            "TDP": "105W",
            "Node": "TSMC 7nm FinFET",
            "OC": true,
            "Socket": "AM4",
            "Tjmax": "90C",
            "Memory": "3200MHz DDR4",
            "PCIe": "PCIe 4.0",
            "ID Tray": "100-000000059",
            "ID Boxed": "100-100000059WOF"
        }
    },
    {
        "id": "2",
        "name": "AMD Ryzen 9 5900X",
        "manufacturer": "AMD",
        "model": "Ryzen 9 5900X",
        "released": "11/5/2020",
        "MSRP": 549,
        "type": api_2.PCPartType["CPU"]
    },
    {
        "id": "3",
        "name": "AMD Ryzen 7 5800X3D",
        "manufacturer": "AMD",
        "model": "Ryzen 7 5800X3D",
        "released": "4/20/2022",
        "MSRP": 449,
        "type": api_2.PCPartType["CPU"]
    },
    {
        "id": "4",
        "name": "AMD Ryzen 7 5800X",
        "manufacturer": "AMD",
        "model": "Ryzen 7 5800X",
        "released": "11/5/2020",
        "MSRP": 449,
        "type": api_2.PCPartType["CPU"]
    },
    {
        "id": "5",
        "name": "AMD Ryzen 7 5700X",
        "manufacturer": "AMD",
        "model": "Ryzen 7 5700X",
        "released": "4/4/2022",
        "MSRP": 299,
        "type": api_2.PCPartType["CPU"]
    },
    {
        "id": "6",
        "name": "AMD Ryzen 5 5600X",
        "manufacturer": "AMD",
        "model": "Ryzen 5 5600X",
        "released": "11/5/2020",
        "MSRP": 299,
        "type": api_2.PCPartType["CPU"]
    },
    {
        "id": "7",
        "name": "AMD Ryzen 5 5600",
        "manufacturer": "AMD",
        "model": "Ryzen 5 5600",
        "released": "4/4/2022",
        "MSRP": 199,
        "type": api_2.PCPartType["CPU"]
    },
    {
        "id": "8",
        "name": "AMD Ryzen 5 5500",
        "manufacturer": "AMD",
        "model": "Ryzen 5 5500",
        "released": "4/4/2022",
        "MSRP": 159,
        "type": api_2.PCPartType["CPU"]
    }
];
const DB = (query) => {
    const params = new api_1.PCPartSearchURI({
        ...query,
        ids: (query.id ?? query.ids),
        oems: (query.oem ?? query.oems),
        types: (query.type ?? query.types),
    });
    let res = testData;
    console.log("query");
    console.log(query);
    console.log("params");
    console.log(params);
    console.log("params.filterIDs.array");
    console.log(params.filterIDs.array);
    console.log("params.filterOEMs.array");
    console.log(params.filterOEMs.array);
    console.log("params.filterTypes.array");
    console.log(params.filterTypes.array);
    console.log("params.maxPriceFilter");
    console.log(params.maxPriceFilter);
    console.log("params.minPriceFilter");
    console.log(params.minPriceFilter);
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
    console.log(params, res);
    return res;
};
exports.DB = DB;
//# sourceMappingURL=database.js.map