"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const part_1 = __importDefault(require("./models/part"));
const news_1 = __importDefault(require("./models/news"));
const { MONGODB, REDIS } = process.env;
if (MONGODB) {
    ;
    (async () => {
        try {
            await mongoose_1.default.connect(MONGODB);
            console.log(`\n\t> MongoDB: "${MONGODB}" initialized...\n`);
            await news_1.default.insertMany([
                {
                    _id: new mongoose_1.default.Types.ObjectId("63584926fbb01a1a8b323ddf"),
                    title: "Story 1",
                    content: "lorem ipsum 1: the beginnings.",
                    createdAt: new Date("2001-01-01T05:00:00.000Z"),
                    updatedAt: new Date("2001-01-01T05:00:00.000Z")
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId("63584926fbb01a1a8b323de0"),
                    title: "Story 2",
                    content: "lorem ipsum 2: the reckoning.",
                    createdAt: new Date("2002-07-01T04:00:00.000Z"),
                    updatedAt: new Date("2002-07-01T04:00:00.000Z")
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId("63584926fbb01a1a8b323de1"),
                    title: "Story 3",
                    content: "lorem ipsum 3: the awakening.",
                    createdAt: new Date("2003-03-26T05:00:00.000Z"),
                    updatedAt: new Date("2003-03-26T05:00:00.000Z")
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId("63584926fbb01a1a8b323de2"),
                    title: "Story 4",
                    content: "lorem ipsum 4: the reasoning.",
                    createdAt: new Date("2004-10-31T04:00:00.000Z"),
                    updatedAt: new Date("2004-10-31T04:00:00.000Z")
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId("63584926fbb01a1a8b323de3"),
                    title: "Story 5",
                    content: "lorem ipsum 5: the beckoning.",
                    createdAt: new Date("2005-08-14T04:00:00.000Z"),
                    updatedAt: new Date("2005-08-14T04:00:00.000Z")
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId("63584926fbb01a1a8b323de4"),
                    title: "Story 6",
                    content: "lorem ipsum 6: the remaking.",
                    createdAt: new Date("2006-01-01T05:00:00.000Z"),
                    updatedAt: new Date("2006-01-01T05:00:00.000Z")
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId("63584926fbb01a1a8b323de5"),
                    title: "Story 7",
                    content: "lorem ipsum 7: the hampering.",
                    createdAt: new Date("2007-01-01T05:00:00.000Z"),
                    updatedAt: new Date("2007-01-01T05:00:00.000Z")
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId("63584926fbb01a1a8b323de6"),
                    title: "Story 8",
                    content: "lorem ipsum 8: the foreshadowing.",
                    createdAt: new Date("2008-01-01T05:00:00.000Z"),
                    updatedAt: new Date("2008-01-01T05:00:00.000Z")
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId("63584926fbb01a1a8b323de7"),
                    title: "Story 9",
                    content: "lorem ipsum 9: the viking.",
                    createdAt: new Date("2009-01-01T05:00:00.000Z"),
                    updatedAt: new Date("2009-01-01T05:00:00.000Z")
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId("63584926fbb01a1a8b323de8"),
                    title: "Story 10",
                    content: "lorem ipsum 10: the harbinger.",
                    createdAt: new Date("2010-10-10T04:00:00.000Z"),
                    updatedAt: new Date("2010-10-10T04:00:00.000Z")
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId("63584926fbb01a1a8b323de9"),
                    title: "Story 11",
                    content: "lorem ipsum 11: the jester.",
                    createdAt: new Date("2011-10-10T04:00:00.000Z"),
                    updatedAt: new Date("2011-10-10T04:00:00.000Z")
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId("63584926fbb01a1a8b323dea"),
                    title: "Story 12",
                    content: "lorem ipsum 12: the conqueror.",
                    createdAt: new Date("2012-10-10T04:00:00.000Z"),
                    updatedAt: new Date("2012-10-10T04:00:00.000Z")
                }
            ]);
            await part_1.default.insertMany([
                {
                    _id: new mongoose_1.default.Types.ObjectId("635326960db6d88a90c6b5a4"),
                    name: "AMD Ryzen 9 5950X",
                    oem: "AMD",
                    model: "Ryzen 9 5950X",
                    released: new Date("2020-11-05T05:00:00.000Z"),
                    MSRP: 799,
                    type: "CPU"
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId("635326960db6d88a90c6b5a5"),
                    name: "AMD Ryzen 9 5900X",
                    oem: "AMD",
                    model: "Ryzen 9 5900X",
                    released: new Date("2020-11-05T05:00:00.000Z"),
                    MSRP: 549,
                    type: "CPU"
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId("635326960db6d88a90c6b5a6"),
                    name: "AMD Ryzen 7 5800X3D",
                    oem: "AMD",
                    model: "Ryzen 7 5800X3D",
                    released: new Date("2022-04-20T04:00:00.000Z"),
                    MSRP: 449,
                    type: "CPU"
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId("635326960db6d88a90c6b5a7"),
                    name: "AMD Ryzen 7 5800X",
                    oem: "AMD",
                    model: "Ryzen 7 5800X",
                    released: new Date("2020-11-05T05:00:00.000Z"),
                    MSRP: 449,
                    type: "CPU"
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId("635326960db6d88a90c6b5a8"),
                    name: "AMD Ryzen 7 5700X",
                    oem: "AMD",
                    model: "Ryzen 7 5700X",
                    released: new Date("2022-04-04T04:00:00.000Z"),
                    MSRP: 299,
                    type: "CPU"
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId("635326960db6d88a90c6b5a9"),
                    name: "AMD Ryzen 5 5600X",
                    oem: "AMD",
                    model: "Ryzen 5 5600X",
                    released: new Date("2020-11-05T05:00:00.000Z"),
                    MSRP: 299,
                    type: "CPU"
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId("635326960db6d88a90c6b5aa"),
                    name: "AMD Ryzen 5 5600",
                    oem: "AMD",
                    model: "Ryzen 5 5600",
                    released: new Date("2022-04-04T04:00:00.000Z"),
                    MSRP: 199,
                    type: "CPU"
                },
                {
                    _id: new mongoose_1.default.Types.ObjectId("635326960db6d88a90c6b5ab"),
                    name: "AMD Ryzen 5 5500",
                    oem: "AMD",
                    model: "Ryzen 5 5500",
                    released: new Date("2022-04-04T04:00:00.000Z"),
                    MSRP: 159,
                    type: "CPU"
                }
            ]);
        }
        catch (err) {
            console.error(err);
        }
    })();
}
//# sourceMappingURL=docker-init-db.js.map