"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoDBReady = exports.dbHandler = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const part_1 = __importDefault(require("./models/part"));
const list_1 = __importDefault(require("./models/list"));
const user_1 = __importDefault(require("./models/user"));
const news_1 = __importDefault(require("./models/news"));
const api_1 = require("../types/api");
const dbHandler = express_1.default.Router();
exports.dbHandler = dbHandler;
const { MONGODB, REDIS, PORT = 8080 } = process.env;
let mongoDBReady = new Promise((resolve) => {
    const sayReady = () => resolve(true);
    mongoose_1.default.connection.on("connected", sayReady).on("connecting", sayReady).on("open", sayReady);
});
exports.mongoDBReady = mongoDBReady;
dbHandler.use(express_1.default.json());
dbHandler.use(express_1.default.urlencoded({ extended: true }));
dbHandler.use((0, cors_1.default)({
    origin: ["*", "http://localhost:5173", `http://localhost:${PORT}`]
}));
if (MONGODB) {
    ;
    (async () => {
        try {
            await mongoose_1.default.connect(MONGODB);
            console.log(`\n\t> MongoDB: "${MONGODB}" ready...\n`);
            exports.mongoDBReady = mongoDBReady = Promise.resolve(true);
            dbHandler.route("/api/v1/parts")
                .get(async (req, res) => {
                try {
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/parts\").get"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params);
                    const id = req.query.id ?? req.query.ids;
                    const name = req.query.name ?? req.query.names;
                    const type = req.query.type ?? req.query.types;
                    const oem = req.query.oem ?? req.query.oems;
                    const model = req.query.model ?? req.query.models;
                    const minPrice = req.query.minPrice;
                    const maxPrice = req.query.maxPrice;
                    const releasedAfter = req.query.releasedAfter;
                    const releasedBefore = req.query.releasedBefore;
                    const typeInfo = req.query.typeInfo;
                    const offset = Number(req.query.offset ?? 0);
                    const limit = Number(req.query.limit ?? 1);
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/parts\").get"], "id", id, "name", name, "type", type, "oem", oem, "model", model, "minPrice", minPrice, "maxPrice", maxPrice, "releasedAfter", releasedAfter, "releasedBefore", releasedBefore, "typeInfo", typeInfo, "offset", offset, "limit", limit);
                    const dbQuery = part_1.default.find();
                    if (id)
                        dbQuery.byId(id);
                    if (name)
                        dbQuery.byName(name);
                    if (type)
                        dbQuery.byType(type);
                    if (oem)
                        dbQuery.byOEM(oem);
                    if (model)
                        dbQuery.byModel(model);
                    if (minPrice)
                        dbQuery.byMinPrice(minPrice);
                    if (maxPrice)
                        dbQuery.byMaxPrice(maxPrice);
                    if (releasedAfter)
                        dbQuery.byReleasedAfter(releasedAfter);
                    if (releasedBefore)
                        dbQuery.byReleasedBefore(releasedBefore);
                    if (typeInfo)
                        dbQuery.byTypeInfo(typeInfo);
                    const dbRes = await dbQuery.exec();
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/parts\").get"], "dbRes", dbRes);
                    if (dbRes != null)
                        res.json(dbRes);
                    else
                        res.sendStatus(404);
                }
                catch (e) {
                    console.error(e);
                    res.sendStatus(400);
                }
            });
            dbHandler.route("/api/v1/parts/id/:id")
                .get(async (req, res) => {
                try {
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.get(\"/api/v1/parts/id/:id\")"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params);
                    const dbRes = await part_1.default.findById(req.params.id).exec();
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.get(\"/api/v1/parts/id/:id\")"], "req.path", req.path, "dbRes", dbRes);
                    if (dbRes != null)
                        res.json(dbRes);
                    else
                        res.sendStatus(404);
                }
                catch (e) {
                    console.error(e);
                    res.sendStatus(400);
                }
            });
            dbHandler.route("/api/v1/lists")
                .get(async (req, res) => {
                try {
                    const offset = Number(req.query.offset ?? 0);
                    const limit = Number(req.query.limit ?? 1);
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/lists\").get"], "offset", offset, "limit", limit, "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params);
                    const dbRes = await list_1.default.find().sort({ createdAt: -1 }).skip(offset).limit(limit).exec();
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/lists\").get"], "dbRes", dbRes);
                    if (dbRes != null)
                        res.json(dbRes);
                    else
                        res.sendStatus(404);
                }
                catch (e) {
                    console.error(e);
                    res.sendStatus(400);
                }
            })
                .post(async (req, res) => {
                try {
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/lists\").post"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params);
                    const dbRes = await new list_1.default({ parts: req.body.parts }).save();
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/lists\").post"], "dbRes", dbRes);
                    if (dbRes != null)
                        res.json(dbRes);
                    else
                        res.sendStatus(404);
                }
                catch (e) {
                    console.error(e);
                    res.sendStatus(400);
                }
            });
            dbHandler.route("/api/v1/lists/id/:id")
                .get(async (req, res) => {
                try {
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/lists/id/:id\").get"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params);
                    const dbRes = await list_1.default.findById(req.params.id).exec();
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/lists/id/:id\").get"], "req.path", req.path, "dbRes", dbRes);
                    if (dbRes != null)
                        res.json(dbRes);
                    else
                        res.sendStatus(404);
                }
                catch (e) {
                    console.error(e);
                    res.sendStatus(400);
                }
            })
                .patch(async (req, res) => {
                try {
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/lists/id/:id\").patch"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params);
                    const dbRes = await list_1.default.updateOne({ _id: req.params.id, user: { $exists: false } }, { $set: { parts: req.body.parts } }).exec();
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/lists/id/:id\").patch"], "req.path", req.path, "dbRes", dbRes);
                    if (dbRes != null)
                        res.json(dbRes);
                    else
                        res.sendStatus(404);
                }
                catch (e) {
                    console.error(e);
                    res.sendStatus(400);
                }
            })
                .delete(async (req, res) => {
                try {
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/lists/id/:id\").delete"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params);
                    const dbRes = await list_1.default.deleteOne({ _id: req.params.id, user: { $exists: false } }).exec();
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/lists/id/:id\").delete"], "req.path", req.path, "dbRes", dbRes);
                    if (dbRes != null)
                        res.json(dbRes);
                    else
                        res.sendStatus(404);
                }
                catch (e) {
                    console.error(e);
                    res.sendStatus(400);
                }
            });
            dbHandler.route("/api/v1/users/id/:id")
                .get(async (req, res) => {
                try {
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/users/id/:id\").get"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params);
                    const dbRes = await user_1.default.findById(req.params.id).select("-password").exec();
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/users/id/:id\").get"], "req.path", req.path, "dbRes", dbRes);
                    if (dbRes != null)
                        res.json(dbRes);
                    else
                        res.sendStatus(404);
                }
                catch (e) {
                    console.error(e);
                    res.sendStatus(400);
                }
            });
            dbHandler.route("/api/v1/users")
                .get(async (req, res) => {
                try {
                    const offset = Number(req.query.offset ?? 0);
                    const limit = Number(req.query.limit ?? 1);
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/users\").get"], "offset", offset, "limit", limit, "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params);
                    const dbRes = await user_1.default.find().select("-password").sort({ createdAt: -1 }).skip(offset).limit(limit).exec();
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/users\").get"], "dbRes", dbRes);
                    if (dbRes != null)
                        res.json(dbRes);
                    else
                        res.sendStatus(404);
                }
                catch (e) {
                    console.error(e);
                    res.sendStatus(400);
                }
            })
                .post(async (req, res) => {
                try {
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/users\").post"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params);
                    const dbRes = await new user_1.default(req.body).save();
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/users\").post"], "dbRes", dbRes);
                    if (dbRes != null)
                        res.json(dbRes);
                    else
                        res.sendStatus(404);
                }
                catch (e) {
                    console.error(e);
                    res.sendStatus(400);
                }
            });
            dbHandler.get("/api/v1/news", async (req, res) => {
                try {
                    const offset = Number(req.query.offset ?? 0);
                    const limit = Number(req.query.limit ?? 1);
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/users\").post"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params);
                    const dbRes = await news_1.default.find({}).sort({ createdAt: -1 }).skip(offset).limit(limit).exec();
                    (0, api_1.dbgLog)("database.ts", ["if(MONGODB)", "dbHandler.route(\"/api/v1/users\").post"], "dbRes", dbRes);
                    if (dbRes != null)
                        res.json(dbRes);
                    else
                        res.sendStatus(404);
                }
                catch (e) {
                    console.error(e);
                    res.sendStatus(400);
                }
            });
        }
        catch (err) {
            console.error(err);
        }
    })();
}
//# sourceMappingURL=database.js.map