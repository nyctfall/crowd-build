import cors from "cors"
import express from "express"
import mongoose, { Types } from "mongoose"
import Parts from "./models/part"
import Lists from "./models/list"
import Users from "./models/user"
import News from "./models/news"
import { dbgLog } from "../types/api"


/**
 * @file Initialize the mock database for use in docker compose.
*/

// databases to initialize with mock data:
const { MONGODB, REDIS } = process.env
 

// mongodb server:
if (MONGODB){
  ;(async () => {
    try {
      // connect to DB:
      await mongoose.connect(MONGODB)
      
      console.log(`\n\t> MongoDB: "${MONGODB}" initialized...\n`)
      
      await News.insertMany([
        {
          _id: new mongoose.Types.ObjectId("63584926fbb01a1a8b323ddf"),
          title: "Story 1",
          content: "lorem ipsum 1: the beginnings.",
          createdAt: new Date("2001-01-01T05:00:00.000Z"),
          updatedAt: new Date("2001-01-01T05:00:00.000Z")
        },
        {
          _id: new mongoose.Types.ObjectId("63584926fbb01a1a8b323de0"),
          title: "Story 2",
          content: "lorem ipsum 2: the reckoning.",
          createdAt: new Date("2002-07-01T04:00:00.000Z"),
          updatedAt: new Date("2002-07-01T04:00:00.000Z")
        },
        {
          _id: new mongoose.Types.ObjectId("63584926fbb01a1a8b323de1"),
          title: "Story 3",
          content: "lorem ipsum 3: the awakening.",
          createdAt: new Date("2003-03-26T05:00:00.000Z"),
          updatedAt: new Date("2003-03-26T05:00:00.000Z")
        },
        {
          _id: new mongoose.Types.ObjectId("63584926fbb01a1a8b323de2"),
          title: "Story 4",
          content: "lorem ipsum 4: the reasoning.",
          createdAt: new Date("2004-10-31T04:00:00.000Z"),
          updatedAt: new Date("2004-10-31T04:00:00.000Z")
        },
        {
          _id: new mongoose.Types.ObjectId("63584926fbb01a1a8b323de3"),
          title: "Story 5",
          content: "lorem ipsum 5: the beckoning.",
          createdAt: new Date("2005-08-14T04:00:00.000Z"),
          updatedAt: new Date("2005-08-14T04:00:00.000Z")
        },
        {
          _id: new mongoose.Types.ObjectId("63584926fbb01a1a8b323de4"),
          title: "Story 6",
          content: "lorem ipsum 6: the remaking.",
          createdAt: new Date("2006-01-01T05:00:00.000Z"),
          updatedAt: new Date("2006-01-01T05:00:00.000Z")
        },
        {
          _id: new mongoose.Types.ObjectId("63584926fbb01a1a8b323de5"),
          title: "Story 7",
          content: "lorem ipsum 7: the hampering.",
          createdAt: new Date("2007-01-01T05:00:00.000Z"),
          updatedAt: new Date("2007-01-01T05:00:00.000Z")
        },
        {
          _id: new mongoose.Types.ObjectId("63584926fbb01a1a8b323de6"),
          title: "Story 8",
          content: "lorem ipsum 8: the foreshadowing.",
          createdAt: new Date("2008-01-01T05:00:00.000Z"),
          updatedAt: new Date("2008-01-01T05:00:00.000Z")
        },
        {
          _id: new mongoose.Types.ObjectId("63584926fbb01a1a8b323de7"),
          title: "Story 9",
          content: "lorem ipsum 9: the viking.",
          createdAt: new Date("2009-01-01T05:00:00.000Z"),
          updatedAt: new Date("2009-01-01T05:00:00.000Z")
        },
        {
          _id: new mongoose.Types.ObjectId("63584926fbb01a1a8b323de8"),
          title: "Story 10",
          content: "lorem ipsum 10: the harbinger.",
          createdAt: new Date("2010-10-10T04:00:00.000Z"),
          updatedAt: new Date("2010-10-10T04:00:00.000Z")
        },
        {
          _id: new mongoose.Types.ObjectId("63584926fbb01a1a8b323de9"),
          title: "Story 11",
          content: "lorem ipsum 11: the jester.",
          createdAt: new Date("2011-10-10T04:00:00.000Z"),
          updatedAt: new Date("2011-10-10T04:00:00.000Z")
        },
        {
          _id: new mongoose.Types.ObjectId("63584926fbb01a1a8b323dea"),
          title: "Story 12",
          content: "lorem ipsum 12: the conqueror.",
          createdAt: new Date("2012-10-10T04:00:00.000Z"),
          updatedAt: new Date("2012-10-10T04:00:00.000Z")
        }
      ])

      await Parts.insertMany([
        {
          _id: new mongoose.Types.ObjectId("635326960db6d88a90c6b5a4"),
          name: "AMD Ryzen 9 5950X",
          oem: "AMD",
          model: "Ryzen 9 5950X",
          released: new Date("2020-11-05T05:00:00.000Z"),
          MSRP: 799,
          type: "CPU"
        },
        {
          _id: new mongoose.Types.ObjectId("635326960db6d88a90c6b5a5"),
          name: "AMD Ryzen 9 5900X",
          oem: "AMD",
          model: "Ryzen 9 5900X",
          released: new Date("2020-11-05T05:00:00.000Z"),
          MSRP: 549,
          type: "CPU"
        },
        {
          _id: new mongoose.Types.ObjectId("635326960db6d88a90c6b5a6"),
          name: "AMD Ryzen 7 5800X3D",
          oem: "AMD",
          model: "Ryzen 7 5800X3D",
          released: new Date("2022-04-20T04:00:00.000Z"),
          MSRP: 449,
          type: "CPU"
        },
        {
          _id: new mongoose.Types.ObjectId("635326960db6d88a90c6b5a7"),
          name: "AMD Ryzen 7 5800X",
          oem: "AMD",
          model: "Ryzen 7 5800X",
          released: new Date("2020-11-05T05:00:00.000Z"),
          MSRP: 449,
          type: "CPU"
        },
        {
          _id: new mongoose.Types.ObjectId("635326960db6d88a90c6b5a8"),
          name: "AMD Ryzen 7 5700X",
          oem: "AMD",
          model: "Ryzen 7 5700X",
          released: new Date("2022-04-04T04:00:00.000Z"),
          MSRP: 299,
          type: "CPU"
        },
        {
          _id: new mongoose.Types.ObjectId("635326960db6d88a90c6b5a9"),
          name: "AMD Ryzen 5 5600X",
          oem: "AMD",
          model: "Ryzen 5 5600X",
          released: new Date("2020-11-05T05:00:00.000Z"),
          MSRP: 299,
          type: "CPU"
        },
        {
          _id: new mongoose.Types.ObjectId("635326960db6d88a90c6b5aa"),
          name: "AMD Ryzen 5 5600",
          oem: "AMD",
          model: "Ryzen 5 5600",
          released: new Date("2022-04-04T04:00:00.000Z"),
          MSRP: 199,
          type: "CPU"
        },
        {
          _id: new mongoose.Types.ObjectId("635326960db6d88a90c6b5ab"),
          name: "AMD Ryzen 5 5500",
          oem: "AMD",
          model: "Ryzen 5 5500",
          released: new Date("2022-04-04T04:00:00.000Z"),
          MSRP: 159,
          type: "CPU"
        }
      ])
    }
    catch (err){
      // something went wrong connecting to DB:
      console.error(err)
    }  
  })()  
}
// MongoDB mock data: 
/*
parts: [
  {
    _id: ObjectId("635326960db6d88a90c6b5a4"),
    name: "AMD Ryzen 9 5950X",
    oem: "AMD",
    model: "Ryzen 9 5950X",
    released: ISODate("2020-11-05T05:00:00.000Z"),
    MSRP: 799,
    type: "CPU"
  },
  {
    _id: ObjectId("635326960db6d88a90c6b5a5"),
    name: "AMD Ryzen 9 5900X",
    oem: "AMD",
    model: "Ryzen 9 5900X",
    released: ISODate("2020-11-05T05:00:00.000Z"),
    MSRP: 549,
    type: "CPU"
  },
  {
    _id: ObjectId("635326960db6d88a90c6b5a6"),
    name: "AMD Ryzen 7 5800X3D",
    oem: "AMD",
    model: "Ryzen 7 5800X3D",
    released: ISODate("2022-04-20T04:00:00.000Z"),
    MSRP: 449,
    type: "CPU"
  },
  {
    _id: ObjectId("635326960db6d88a90c6b5a7"),
    name: "AMD Ryzen 7 5800X",
    oem: "AMD",
    model: "Ryzen 7 5800X",
    released: ISODate("2020-11-05T05:00:00.000Z"),
    MSRP: 449,
    type: "CPU"
  },
  {
    _id: ObjectId("635326960db6d88a90c6b5a8"),
    name: "AMD Ryzen 7 5700X",
    oem: "AMD",
    model: "Ryzen 7 5700X",
    released: ISODate("2022-04-04T04:00:00.000Z"),
    MSRP: 299,
    type: "CPU"
  },
  {
    _id: ObjectId("635326960db6d88a90c6b5a9"),
    name: "AMD Ryzen 5 5600X",
    oem: "AMD",
    model: "Ryzen 5 5600X",
    released: ISODate("2020-11-05T05:00:00.000Z"),
    MSRP: 299,
    type: "CPU"
  },
  {
    _id: ObjectId("635326960db6d88a90c6b5aa"),
    name: "AMD Ryzen 5 5600",
    oem: "AMD",
    model: "Ryzen 5 5600",
    released: ISODate("2022-04-04T04:00:00.000Z"),
    MSRP: 199,
    type: "CPU"
  },
  {
    _id: ObjectId("635326960db6d88a90c6b5ab"),
    name: "AMD Ryzen 5 5500",
    oem: "AMD",
    model: "Ryzen 5 5500",
    released: ISODate("2022-04-04T04:00:00.000Z"),
    MSRP: 159,
    type: "CPU"
  }
]
news: [
  {
    _id: ObjectId("63584926fbb01a1a8b323ddf"),
    title: "Story 1",
    content: "lorem ipsum 1: the beginnings.",
    createdAt: ISODate("2001-01-01T05:00:00.000Z"),
    updatedAt: ISODate("2001-01-01T05:00:00.000Z")
  },
  {
    _id: ObjectId("63584926fbb01a1a8b323de0"),
    title: "Story 2",
    content: "lorem ipsum 2: the reckoning.",
    createdAt: ISODate("2002-07-01T04:00:00.000Z"),
    updatedAt: ISODate("2002-07-01T04:00:00.000Z")
  },
  {
    _id: ObjectId("63584926fbb01a1a8b323de1"),
    title: "Story 3",
    content: "lorem ipsum 3: the awakening.",
    createdAt: ISODate("2003-03-26T05:00:00.000Z"),
    updatedAt: ISODate("2003-03-26T05:00:00.000Z")
  },
  {
    _id: ObjectId("63584926fbb01a1a8b323de2"),
    title: "Story 4",
    content: "lorem ipsum 4: the reasoning.",
    createdAt: ISODate("2004-10-31T04:00:00.000Z"),
    updatedAt: ISODate("2004-10-31T04:00:00.000Z")
  },
  {
    _id: ObjectId("63584926fbb01a1a8b323de3"),
    title: "Story 5",
    content: "lorem ipsum 5: the beckoning.",
    createdAt: ISODate("2005-08-14T04:00:00.000Z"),
    updatedAt: ISODate("2005-08-14T04:00:00.000Z")
  },
  {
    _id: ObjectId("63584926fbb01a1a8b323de4"),
    title: "Story 6",
    content: "lorem ipsum 6: the remaking.",
    createdAt: ISODate("2006-01-01T05:00:00.000Z"),
    updatedAt: ISODate("2006-01-01T05:00:00.000Z")
  },
  {
    _id: ObjectId("63584926fbb01a1a8b323de5"),
    title: "Story 7",
    content: "lorem ipsum 7: the hampering.",
    createdAt: ISODate("2007-01-01T05:00:00.000Z"),
    updatedAt: ISODate("2007-01-01T05:00:00.000Z")
  },
  {
    _id: ObjectId("63584926fbb01a1a8b323de6"),
    title: "Story 8",
    content: "lorem ipsum 8: the foreshadowing.",
    createdAt: ISODate("2008-01-01T05:00:00.000Z"),
    updatedAt: ISODate("2008-01-01T05:00:00.000Z")
  },
  {
    _id: ObjectId("63584926fbb01a1a8b323de7"),
    title: "Story 9",
    content: "lorem ipsum 9: the viking.",
    createdAt: ISODate("2009-01-01T05:00:00.000Z"),
    updatedAt: ISODate("2009-01-01T05:00:00.000Z")
  },
  {
    _id: ObjectId("63584926fbb01a1a8b323de8"),
    title: "Story 10",
    content: "lorem ipsum 10: the harbinger.",
    createdAt: ISODate("2010-10-10T04:00:00.000Z"),
    updatedAt: ISODate("2010-10-10T04:00:00.000Z")
  },
  {
    _id: ObjectId("63584926fbb01a1a8b323de9"),
    title: "Story 11",
    content: "lorem ipsum 11: the jester.",
    createdAt: ISODate("2011-10-10T04:00:00.000Z"),
    updatedAt: ISODate("2011-10-10T04:00:00.000Z")
  },
  {
    _id: ObjectId("63584926fbb01a1a8b323dea"),
    title: "Story 12",
    content: "lorem ipsum 12: the conqueror.",
    createdAt: ISODate("2012-10-10T04:00:00.000Z"),
    updatedAt: ISODate("2012-10-10T04:00:00.000Z")
  }
]
 */