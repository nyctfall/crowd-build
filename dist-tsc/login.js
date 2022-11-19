"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("./models/user"));
const list_1 = __importDefault(require("./models/list"));
const database_1 = require("./database");
const api_1 = require("../types/api");
const login = express_1.default.Router();
exports.login = login;
const { PORT = 8080, SECRET = "secret" } = process.env;
login.use((0, cors_1.default)({
    origin: ["*", "http://localhost:5173", `http://localhost:${PORT}`]
}));
login.use(express_1.default.json());
login.use(express_1.default.urlencoded({ extended: true }));
database_1.mongoDBReady.then(() => {
    console.log("\n\t> Login Session ready...");
    const validTokens = new Set();
    const jwtVerifyPromise = (token, SECRET) => new Promise((resolve, reject) => jsonwebtoken_1.default.verify(token, SECRET, (err, decodedJWT) => err ? reject(err) : resolve(decodedJWT)));
    const jwtSign = (payload) => new Promise((resolve, reject) => jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn: "5m" }, (err, token) => err ? reject(err) : resolve(token)));
    login.post("/api/v1/login", async (req, res) => {
        try {
            const { username, password } = req.body;
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.post(\"/api/v1/login\")"], "username", username, "password", password, "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params);
            const user = await user_1.default.findOne({ username }).exec();
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.post(\"/api/v1/login\")"], "user", user);
            if (!user) {
                res.json({ success: false, nonexistant: true });
                return;
            }
            if (password !== user.password) {
                res.json({ success: false, conflict: true, incorrect: ["password"] });
                return;
            }
            const token = await jwtSign({ id: user.id, username: user.username });
            validTokens.add(token);
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.post(\"/api/v1/login\")"], "token", token, "validTokens", validTokens, "user", user);
            res.json({ success: true, user, token });
        }
        catch (e) {
            console.error(e);
            res.sendStatus(400);
        }
    });
    login.post("/api/v1/signup", async (req, res) => {
        try {
            const { username, password } = req.body;
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.post(\"/api/v1/signup\")"], "username", username, "password", password, "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params);
            const userTaken = await user_1.default.find({ username }).exec();
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.post(\"/api/v1/signup\")"], "userTaken", userTaken);
            if (userTaken.length > 0) {
                res.json({ success: false, conflict: true, preexisting: ["username"] });
                return;
            }
            const newUser = new user_1.default({ username, password });
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.post(\"/api/v1/signup\")"], "newUser", newUser);
            await newUser.save();
            const token = await jwtSign({ id: newUser.id, username: newUser.username });
            validTokens.add(token);
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.post(\"/api/v1/signup\")"], "token", token, "valvalidTokens", validTokens);
            res.json({ success: true, user: newUser.toObject(), token });
        }
        catch (e) {
            console.error(e);
            res.sendStatus(400);
        }
    });
    login.post("/api/v1/logout", async (req, res) => {
        (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.post(\"/api/v1/logout\")"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params, "req.user", req.user, "req.headers", req.headers);
        const tokenToInvalidate = req.headers.authorization?.split(' ')[1];
        (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.post(\"/api/v1/logout\")"], "tokenToInvalidate", tokenToInvalidate);
        if (tokenToInvalidate && validTokens.has(tokenToInvalidate) && !validTokens.delete(tokenToInvalidate) && validTokens.has(tokenToInvalidate)) {
            res.status(500).send({ success: false });
            return;
        }
        res.send({ success: true });
    });
    login.use(["/api/v1/profile", "/api/v1/profile/*"], async (req, res, next) => {
        (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.use([\"/api/v1/profile\", \"/api/v1/profile/*\"],)"], "req.path", req.path, "request.headers", req.headers, "req.body", req.body, "req.query", req.query, "req.params", req.params, "req.user", req.user);
        const token = req.headers.authorization?.split(' ')[1];
        try {
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.use([\"/api/v1/profile\", \"/api/v1/profile/*\"],)"], "token", token);
            if (!token || !validTokens.has(token)) {
                res.status(401).redirect("/api/v1/login");
                return;
            }
            const decodedToken = await jwtVerifyPromise(token, SECRET);
            req.user = decodedToken;
            req._jwtToken = token;
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.use([\"/api/v1/profile\", \"/api/v1/profile/*\"],)"], "token", token, "decodedToken", decodedToken, "req.user", req.user);
            next();
        }
        catch (e) {
            console.error(e);
            if (token)
                validTokens.delete(token);
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.use([\"/api/v1/profile\", \"/api/v1/profile/*\"],)"], "token", token, "validTokens", validTokens, "req.user", req.user);
            res.redirect("/api/v1/login");
        }
    });
    login.route("/api/v1/profile/lists")
        .get(async (req, res) => {
        try {
            const offset = Number(req.query.offset ?? 0);
            const limit = Number(req.query.limit ?? 1);
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile/lists\").get"], "offset", offset, "limit", limit, "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params, "req.user", req.user);
            const dbRes = await list_1.default.find({ user: req.user?.id }).sort({ createdAt: -1 }).skip(offset).limit(limit).exec();
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile/lists\").get"], "dbRes", dbRes);
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
            const newList = await new list_1.default({ parts: req.body.parts, user: req.user?.id }).save();
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile/lists\").post"], "newList", newList, "logged in user", req.user, "req.body", req.body, "req.params", req.params, "req.query", req.query);
            const user = await user_1.default.findById(req.user?.id).exec();
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile/lists\").post"], "mongo user before", user?.toJSON());
            if (!user) {
                res.json(newList);
                return;
            }
            if (user.lists)
                user.lists.push(newList.id);
            else
                user.lists = [newList.id];
            await user.save();
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile/lists\").post"], "mongo user after", (await user.populate("lists")).toJSON());
            if (newList != null)
                res.json(newList);
            else
                res.sendStatus(400);
        }
        catch (e) {
            console.error(e);
            res.sendStatus(400);
        }
    })
        .delete(async (req, res) => {
        try {
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile/lists\").get"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params, "req.user", req.user);
            const dbRes = await list_1.default.deleteMany({ user: req.user?.id }).exec();
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile/lists\").get"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params, "req.user", req.user);
            if (dbRes != null)
                res.json(dbRes);
            else
                res.sendStatus(400);
        }
        catch (e) {
            console.error(e);
            res.sendStatus(400);
        }
    });
    login.route("/api/v1/profile/lists/id/:id")
        .patch(async (req, res) => {
        try {
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile/lists/id/:id\").patch"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params, "req.user", req.user);
            const dbRes = await list_1.default.updateOne({ _id: req.params.id, user: req.user?.id }, { $set: { parts: req.body.parts } }).exec();
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile/lists/id/:id\").patch"], "req.path", req.path, "dbRes", dbRes);
            if (dbRes != null)
                res.json(dbRes);
            else
                res.sendStatus(400);
        }
        catch (e) {
            console.error(e);
            res.sendStatus(400);
        }
    })
        .delete(async (req, res) => {
        try {
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile/lists/id/:id\").delete"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params, "req.user", req.user);
            const dbUserRes = await user_1.default.findById(req.user?.id).exec();
            if (dbUserRes && dbUserRes.lists) {
                dbUserRes.lists = dbUserRes.lists.filter(listId => !listId.equals(req.params.id));
                dbUserRes.save();
                (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile/lists/id/:id\").delete"], "req.path", req.path, "dbUserRes", dbUserRes);
            }
            const dbListRes = await list_1.default.deleteOne({ _id: req.params.id, user: req.user?.id }).exec();
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile/lists/id/:id\").delete"], "req.path", req.path, "dbListRes", dbListRes);
            if (dbListRes != null)
                res.json(dbListRes);
            else
                res.sendStatus(400);
        }
        catch (e) {
            console.error(e);
            res.sendStatus(400);
        }
    });
    login.route("/api/v1/profile")
        .patch(async (req, res) => {
        try {
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile\").patch"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params, "req.user", req.user);
            const dbRes = await user_1.default.updateOne({ _id: req.user?.id }, { $set: { username: req.body.username } }).exec();
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile\").patch"], "dbRes", dbRes);
            if (dbRes)
                res.json(dbRes);
            else
                res.sendStatus(400);
        }
        catch (e) {
            console.error(e);
            res.sendStatus(400);
        }
    })
        .delete(async (req, res) => {
        try {
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile\").delete"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params, "req.user", req.user);
            const dbListRes = await list_1.default.deleteMany({ user: req.user?.id }).exec();
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile\").delete"], "dbListRes", dbListRes);
            const dbUserRes = await user_1.default.deleteOne({ _id: req.user?.id }).exec();
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile\").delete"], "dbUserRes", dbUserRes);
            res.json(dbUserRes);
            validTokens.delete(req._jwtToken);
            validTokens.forEach((token) => {
                let jwtSession;
                try {
                    jwtSession = jsonwebtoken_1.default.decode(token);
                }
                catch (e) {
                    console.error(e);
                }
                (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile\").delete", "validTokens.forEach"], "token", token, "jwtSession", jwtSession, "req._jwtToken", req._jwtToken, "validTokens", validTokens);
                if (jwtSession && typeof jwtSession === "object" && typeof jwtSession.id === "string" && jwtSession.id === req.user?.id)
                    validTokens.delete(token);
            });
            (0, api_1.dbgLog)("login.ts", ["mongoDBReady.then", "login.route(\"/api/v1/profile\").delete"], "req._jwtToken", req._jwtToken, "validTokens", validTokens);
        }
        catch (e) {
            console.error(e);
            res.sendStatus(400);
        }
    });
});
//# sourceMappingURL=login.js.map