import Big from "big.js"
import { Request } from "express"
import { PCPartInfo, PCPartSearchURI } from "../types/api"
import { PCPartType } from "../types/api"


const testData: PCPartInfo[] = [
  {
    "id": "1",
    "name": "AMD Ryzen 9 5950X",
    "manufacturer": "AMD",
    "model": "Ryzen 9 5950X",
    "released": "11/5/2020",
    "MSRP": 799,
    "type": PCPartType["CPU"],
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
    "type": PCPartType["CPU"]
  },
  {
    "id": "3",
    "name": "AMD Ryzen 7 5800X3D",
    "manufacturer": "AMD",
    "model": "Ryzen 7 5800X3D",
    "released": "4/20/2022",
    "MSRP": 449,
    "type": PCPartType["CPU"]
  },
  {
    "id": "4",
    "name": "AMD Ryzen 7 5800X",
    "manufacturer": "AMD",
    "model": "Ryzen 7 5800X",
    "released": "11/5/2020",
    "MSRP": 449,
    "type": PCPartType["CPU"]
  },
  {
    "id": "5",
    "name": "AMD Ryzen 7 5700X",
    "manufacturer": "AMD",
    "model": "Ryzen 7 5700X",
    "released": "4/4/2022",
    "MSRP": 299,
    "type": PCPartType["CPU"]
  },
  {
    "id": "6",
    "name": "AMD Ryzen 5 5600X",
    "manufacturer": "AMD",
    "model": "Ryzen 5 5600X",
    "released": "11/5/2020",
    "MSRP": 299,
    "type": PCPartType["CPU"]
  },
  {
    "id": "7",
    "name": "AMD Ryzen 5 5600",
    "manufacturer": "AMD",
    "model": "Ryzen 5 5600",
    "released": "4/4/2022",
    "MSRP": 199,
    "type": PCPartType["CPU"]
  },
  {
    "id": "8",
    "name": "AMD Ryzen 5 5500",
    "manufacturer": "AMD",
    "model": "Ryzen 5 5500",
    "released": "4/4/2022",
    "MSRP": 159,
    "type": PCPartType["CPU"]
  }
]


/** @todo Redis cache test DB */
export const DB = (query: qs.ParsedQs | Record<string, string | string[]>): PCPartInfo[] => {
  const params = new PCPartSearchURI({
    ...query,
    ids: (query.id ?? query.ids as any),
    oems: (query.oem ?? query.oems as any),
    types: (query.type ?? query.types as any),
  })
  
  /** @todo Redis cache test DB */
  let res: PCPartInfo[] = testData


  console.log("query")
  console.log(query)
  console.log("params")
  console.log(params)
  console.log("params.filterIDs.array")
  console.log(params.filterIDs.array)
  console.log("params.filterOEMs.array")
  console.log(params.filterOEMs.array)
  console.log("params.filterTypes.array")
  console.log(params.filterTypes.array)
  console.log("params.maxPriceFilter")
  console.log(params.maxPriceFilter)
  console.log("params.minPriceFilter")
  console.log(params.minPriceFilter)
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

  console.log(params,res)
  return res
}