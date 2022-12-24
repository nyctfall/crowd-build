"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongooseConnectPromise = exports.mongooseConnect = exports.dbHandler = void 0;
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const api_1 = require("~types/api");
const part_1 = __importDefault(require("./models/part"));
const list_1 = __importDefault(require("./models/list"));
const user_1 = __importDefault(require("./models/user"));
const news_1 = __importDefault(require("./models/news"));
const dbHandler = express_1.default.Router();
exports.dbHandler = dbHandler;
const { MONGODB = "mongodb://127.0.0.1:27017", REDIS } = process.env;
const log = api_1.dbgLog.fileLogger("database.ts");
let mongooseConnectPromise;
exports.mongooseConnectPromise = mongooseConnectPromise;
let mongooseConnect;
exports.mongooseConnect = mongooseConnect;
(async () => {
    if (!MONGODB) {
        log.error("MONGODB == false", "err", "\n\tERROR! Error: No MongoDB database!!!!".repeat(10));
        return dbHandler.use((_req, res) => {
            log.error(["MONGODB == false", "dbHandler.use"], "err", "\n\tERROR! Error: No MongoDB database!!!!".repeat(20));
            res.sendStatus(api_1.HTTPStatusCode["Service Unavailable"]);
        });
    }
    try {
        exports.mongooseConnectPromise = mongooseConnectPromise = mongoose_1.default.connect(MONGODB);
        exports.mongooseConnect = mongooseConnect = await mongooseConnectPromise;
        console.log(`\n\t> MongoDB: "${MONGODB}" ready...`);
        dbHandler
            .route("/parts")
            .get(async (req, res) => {
            const Log = log.stackLogger("dbHandler.route('/parts').get");
            Log("req.query", req.query);
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
            const limit = Number(req.query.limit ?? Infinity);
            Log("id", id, "name", name, "type", type, "oem", oem, "model", model, "minPrice", minPrice, "maxPrice", maxPrice, "releasedAfter", releasedAfter, "releasedBefore", releasedBefore, "typeInfo", typeInfo, "offset", offset, "limit", limit);
            try {
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
                Log("dbQuery", dbQuery);
                const dbRes = await dbQuery.exec();
                Log("dbRes", dbRes);
                if (dbRes.length > 0)
                    res.json(dbRes);
                else
                    res.status(api_1.HTTPStatusCode["Not Found"]).json(dbRes);
            }
            catch (e) {
                Log.error("err", e);
                res.sendStatus(api_1.HTTPStatusCode["Bad Request"]);
            }
        });
        dbHandler
            .route("/parts/id/:id")
            .get(async (req, res) => {
            const Log = log.stackLogger("dbHandler.get('/parts/id/:id')");
            Log("req.params", req.params);
            try {
                const dbRes = await part_1.default.findById(req.params.id).exec();
                Log("dbRes", dbRes);
                if (dbRes)
                    res.json(dbRes);
                else
                    res.sendStatus(api_1.HTTPStatusCode["Not Found"]);
            }
            catch (e) {
                Log.error("err", e);
                res.sendStatus(api_1.HTTPStatusCode["Bad Request"]);
            }
        });
        dbHandler
            .route("/lists")
            .get(async (req, res) => {
            const Log = log.stackLogger("dbHandler.route('/lists').get");
            Log("req.query", req.query);
            const offset = Number(req.query.offset ?? 0);
            const limit = Number(req.query.limit ?? Infinity);
            Log("offset", offset, "limit", limit);
            try {
                const dbRes = await list_1.default.find().sort({ createdAt: -1 }).skip(offset).limit(limit).exec();
                Log("dbRes", dbRes);
                if (dbRes.length > 0)
                    res.json(dbRes);
                else
                    res.status(api_1.HTTPStatusCode["Not Found"]).json(dbRes);
            }
            catch (e) {
                Log.error("err", e);
                res.sendStatus(api_1.HTTPStatusCode["Bad Request"]);
            }
        })
            .post(async (req, res) => {
            const Log = log.stackLogger("dbHandler.route('/lists').post");
            Log("req.body", req.body);
            try {
                const dbRes = await new list_1.default({ parts: req.body.parts }).save();
                Log("dbRes", dbRes);
                res.status(api_1.HTTPStatusCode["Created"]).json(dbRes);
            }
            catch (e) {
                Log.error("err", e);
                res.sendStatus(api_1.HTTPStatusCode["Bad Request"]);
            }
        });
        dbHandler
            .route("/lists/id/:id")
            .get(async (req, res) => {
            const Log = log.stackLogger("dbHandler.route('/lists/id/:id').get");
            Log("req.params", req.params);
            try {
                const dbRes = await list_1.default.findById(req.params.id).exec();
                Log("dbRes", dbRes);
                if (dbRes)
                    res.json(dbRes);
                else
                    res.sendStatus(api_1.HTTPStatusCode["Not Found"]);
            }
            catch (e) {
                Log.error("err", e);
                res.sendStatus(api_1.HTTPStatusCode["Bad Request"]);
            }
        })
            .patch(async (req, res) => {
            const Log = log.stackLogger("dbHandler.route('/lists/id/:id').patch");
            Log("req.params", req.params);
            try {
                const dbRes = await list_1.default.updateOne({
                    _id: req.params.id,
                    user: { $exists: false }
                }, { $set: { parts: req.body.parts } }).exec();
                Log("dbRes", dbRes);
                res.json(dbRes);
            }
            catch (e) {
                Log.error("err", e);
                res.sendStatus(api_1.HTTPStatusCode["Bad Request"]);
            }
        })
            .delete(async (req, res) => {
            const Log = log.stackLogger("dbHandler.route('/lists/id/:id').delete");
            Log("req.params", req.params);
            try {
                const dbRes = await list_1.default.deleteOne({
                    _id: req.params.id,
                    user: { $exists: false }
                }).exec();
                Log("dbRes", dbRes);
                res.json(dbRes);
            }
            catch (e) {
                Log.error("err", e);
                res.sendStatus(api_1.HTTPStatusCode["Bad Request"]);
            }
        });
        dbHandler.get("/users/id/:id", async (req, res) => {
            const Log = log.stackLogger("dbHandler.route('/users/id/:id').get");
            Log("req.params", req.params);
            try {
                const dbRes = await user_1.default.findById(req.params.id).select("-password").exec();
                Log("dbRes", dbRes);
                if (dbRes)
                    res.json(dbRes);
                else
                    res.sendStatus(api_1.HTTPStatusCode["Not Found"]);
            }
            catch (e) {
                Log.error("err", e);
                res.sendStatus(api_1.HTTPStatusCode["Bad Request"]);
            }
        });
        dbHandler.get("/users", async (req, res) => {
            const Log = log.stackLogger("dbHandler.route('/users').get");
            Log("req.query", req.query);
            const offset = Number(req.query.offset ?? 0);
            const limit = Number(req.query.limit ?? Infinity);
            Log("offset", offset, "limit", limit);
            try {
                const dbRes = await user_1.default
                    .find()
                    .select("-password")
                    .sort({ createdAt: -1 })
                    .skip(offset)
                    .limit(limit)
                    .exec();
                Log("dbRes", dbRes);
                if (dbRes.length > 0)
                    res.json(dbRes);
                else
                    res.status(api_1.HTTPStatusCode["Not Found"]).json(dbRes);
            }
            catch (e) {
                Log.error("err", e);
                res.sendStatus(api_1.HTTPStatusCode["Bad Request"]);
            }
        });
        dbHandler.get("/news", async (req, res) => {
            const Log = log.stackLogger("dbHandler.route('/news').get");
            Log("req.query", req.query);
            const offset = Number(req.query.offset ?? 0);
            const limit = Number(req.query.limit ?? 1);
            Log("offset", offset, "limit", limit);
            try {
                const dbRes = await news_1.default.find({}).sort({ createdAt: -1 }).skip(offset).limit(limit).exec();
                Log("dbRes", dbRes);
                if (dbRes.length > 0)
                    res.json(dbRes);
                else
                    res.status(api_1.HTTPStatusCode["Not Found"]).json(dbRes);
            }
            catch (e) {
                Log.error("err", e);
                res.sendStatus(api_1.HTTPStatusCode["Bad Request"]);
            }
        });
    }
    catch (e) {
        log.error("catch await mongoose.connect", "err", e);
        dbHandler.use((_req, res) => {
            log.error(["catch await mongoose.connect", "dbHandler.use"], "err", "\n\tError connecting to MongoDB database!!!!".repeat(10));
            res.sendStatus(api_1.HTTPStatusCode["Service Unavailable"]);
        });
    }
})();
//# sourceMappingURL=database.js.map