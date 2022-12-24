"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const api_1 = require("~types/api");
const database_1 = require("./database");
const user_1 = __importDefault(require("./models/user"));
const list_1 = __importDefault(require("./models/list"));
const logouts_1 = __importDefault(require("./models/logouts"));
const login = express_1.default.Router();
exports.login = login;
const { SECRET = "" } = process.env;
if (!SECRET)
    console.error(`\n\tERROR! Error: SECRET should be defined in ".env" file.`.repeat(10));
const log = api_1.dbgLog.fileLogger("login.ts");
const maxAge = 1000 * 60 * 10;
const jwtSign = (payload) => new Promise((resolve, reject) => jsonwebtoken_1.default.sign(payload, SECRET, {
    expiresIn: `${maxAge}ms`,
    subject: payload.id
}, (err, token) => (err ? reject(err) : resolve(token))));
const setJWTCookie = (res, token) => res.cookie("jwt", token, {
    expires: new Date(Date.now() + maxAge),
    httpOnly: false
});
const passwordHash = (password) => bcrypt_1.default.hash(password, 10);
const validateUserPass = (reqBody) => {
    const { username, password } = reqBody;
    log("validateUserPass", "username", username, "password", password);
    if (!username)
        throw Error("username not defined in request");
    if (!password)
        throw Error("password not defined in request");
    if (typeof username !== "string")
        throw Error("username not string");
    if (typeof password !== "string")
        throw Error("password not string");
    if (username.match(/([^\u0020-\uFFFF])+/giu))
        throw Error("username has invalid ASCII control characters");
    if (password.match(/([^\u0020-\uFFFF])+/giu))
        throw Error("password has invalid ASCII control characters");
    return {
        username,
        password
    };
};
const logoutJWT = (token) => {
    const payload = jsonwebtoken_1.default.decode(token);
    let expireAt;
    if (payload?.exp)
        expireAt = new Date(payload.exp * 1000);
    else
        expireAt = new Date(Date.now() + maxAge);
    const dbRes = new logouts_1.default({ token, expireAt }).save();
    log("logoutJWT", "payload", payload, "expireAt", expireAt, "dbRes", dbRes);
    return dbRes;
};
const authHeaderExtractor = req => {
    const Log = log.stackLogger("authHeaderExtractor");
    Log("req.headers", req.headers, "req.headers.authorization", req.headers?.authorization);
    if (req && req.headers && req.headers.authorization) {
        const auth = req.headers.authorization?.split(/\s+/);
        if (auth.length < 2)
            return null;
        let token = auth[1];
        Log("auth", auth, "token", token, "jwt", jsonwebtoken_1.default.decode(token, { complete: true }));
        return token;
    }
    return null;
};
const cookieExtractor = req => {
    const Log = log.stackLogger("cookieExtractor");
    Log("req.cookies", req.cookies);
    if (req && req.cookies && typeof req.cookies["jwt"] === "string") {
        const token = req.cookies["jwt"];
        Log("token", token, "jwt", jsonwebtoken_1.default.decode(token, { complete: true }));
        return token;
    }
    return null;
};
const JWTExtractor = passport_jwt_1.default.ExtractJwt.fromExtractors([authHeaderExtractor, cookieExtractor]);
const JWTStratOpts = {
    secretOrKey: SECRET,
    passReqToCallback: true,
    jwtFromRequest: JWTExtractor
};
const JWTStratVerify = async (req, jwtPayload, done) => {
    const Log = log.stackLogger("JWTStratVerifyCb");
    const token = JWTExtractor(req);
    Log("jwtPayload", jwtPayload, "jwt", jsonwebtoken_1.default.decode(token, { complete: true }));
    try {
        const dbRes = await logouts_1.default.findOne({ token }).exec();
        Log("Logouts dbRes", dbRes);
        if (dbRes)
            return done(null, false);
    }
    catch (e) {
        Log.error("Logouts.findOne error", e);
        done(e, false);
    }
    try {
        const user = await user_1.default.findById(jwtPayload.id).exec();
        Log("user", user);
        if (user)
            return done(null, user, { token, jwtPayload });
        try {
            const dbRes = await logoutJWT(token);
            Log("new Logouts dbRes", dbRes);
            done(null, false);
        }
        catch (e) {
            Log.error("new Logouts error", e);
            done(e, false);
        }
    }
    catch (e) {
        Log.error("Users.findOne error", e);
        done(e, false);
    }
};
const JWTStrat = new passport_jwt_1.default.Strategy(JWTStratOpts, JWTStratVerify);
const passportInit = passport_1.default.initialize({ userProperty: "user" });
login.use(passportInit);
passport_1.default.use("jwt", JWTStrat);
passport_1.default.serializeUser(async (user, done) => {
    log("passport.serializeUser", "user", user);
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    const Log = log.stackLogger("passport.deserializeUser");
    Log("id", id);
    try {
        const user = await user_1.default.findById(id).exec();
        Log("user", user);
        if (user)
            return done(null, user);
        done(null, false);
    }
    catch (e) {
        Log.error("Users.findById error", e);
        done(e, false);
    }
});
database_1.mongooseConnectPromise
    .then(mongoose => {
    console.log("\n\t> Login Session ready...");
    login.use(["/profile", "/profile/*", "/logout"], passport_1.default.authenticate("jwt", { session: false }));
    login.use((req, _res, next) => {
        log("login.use", "req.user", req.user, "req.authInfo", req.authInfo, "req.isAuthenticated()", req.isAuthenticated?.(), "req.isUnauthenticated()", req.isUnauthenticated?.());
        next();
    });
    login.post("/login", async (req, res) => {
        const Log = log.stackLogger("login.post('/login')");
        Log("req.body", req.body);
        const { username, password } = validateUserPass(req.body);
        try {
            const user = await user_1.default.findOne({ username }).exec();
            Log("user", user);
            if (!user)
                return res.status(api_1.HTTPStatusCode["Not Found"]).json({
                    success: false,
                    nonexistant: true
                });
            const psswdComp = await bcrypt_1.default.compare(password, user.password);
            Log("password", password, "user.password", user.password, "psswdComp", psswdComp);
            if (!psswdComp)
                return res.status(api_1.HTTPStatusCode["Unauthorized"]).json({
                    success: false,
                    conflict: true,
                    incorrect: ["password"]
                });
            const token = await jwtSign({ id: user.id });
            Log("token", token);
            setJWTCookie(res, token);
            res.json({
                success: true,
                user,
                token
            });
        }
        catch (e) {
            Log.error("err", e);
            res.send(400).json({ success: false });
        }
    });
    login.post("/signup", async (req, res) => {
        const Log = log.stackLogger("login.post('/signup')");
        Log("req.body", req.body);
        try {
            const { username, password } = validateUserPass(req.body);
            const userTaken = await user_1.default.findOne({ username }).exec();
            Log("userTaken", userTaken);
            if (userTaken)
                return res.status(api_1.HTTPStatusCode["Conflict"]).json({
                    success: false,
                    conflict: true,
                    preexisting: ["username"]
                });
            const newUser = await new user_1.default({
                username,
                password: await passwordHash(password)
            }).save();
            Log("newUser", newUser);
            const token = await jwtSign({ id: newUser.id });
            Log("token", token);
            setJWTCookie(res, token);
            res.status(api_1.HTTPStatusCode["Created"]).json({
                success: true,
                user: newUser.toObject(),
                token
            });
        }
        catch (e) {
            Log.error("err", e);
            res.send(400).json({ success: false });
        }
    });
    login.post("/logout", async (req, res) => {
        const Log = log.stackLogger("login.post('/logout')");
        Log("req.authInfo", req.authInfo, "maxAge", maxAge);
        try {
            const dbRes = await logoutJWT(req.authInfo?.token);
            Log("new Logouts dbRes", dbRes);
            if (dbRes)
                return res.send({ success: true });
            res.status(api_1.HTTPStatusCode["Internal Server Error"]).send({ success: false });
        }
        catch (e) {
            Log.error("new Logouts error", e);
            res.status(api_1.HTTPStatusCode["Internal Server Error"]).send({ success: false });
        }
    });
    login
        .route("/profile/lists")
        .get(async (req, res) => {
        const Log = log.stackLogger("login.route('/profile/lists').get");
        Log("req.query", req.query);
        const offset = Number(req.query.offset ?? 0);
        const limit = Number(req.query.limit ?? Infinity);
        Log("offset", offset, "limit", limit);
        try {
            const dbRes = await list_1.default.find({ user: req.user?.id })
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
    })
        .post(async (req, res) => {
        const Log = log.stackLogger("login.route('/profile/lists').post");
        Log("req.body", req.body, "req.user", req.user);
        try {
            const newList = await new list_1.default({
                parts: req.body.parts,
                user: req.user?.id
            }).save();
            Log("newList", newList);
            if (!newList)
                return res.sendStatus(api_1.HTTPStatusCode["Internal Server Error"]);
            const user = await user_1.default.findById(req.user?.id).exec();
            Log("mongo user before", user?.toJSON());
            if (!user) {
                await newList.update({ $unset: { user: "" } });
                return res.status(api_1.HTTPStatusCode["Not Found"]).json(newList);
            }
            if (user.lists)
                user.lists.push(newList.id);
            else
                user.lists = [newList.id];
            await user.save();
            Log("mongo user after", (await user.populate("lists")).toJSON());
            res.status(api_1.HTTPStatusCode["Created"]).json(newList);
        }
        catch (e) {
            Log.error("err", e);
            res.sendStatus(api_1.HTTPStatusCode["Bad Request"]);
        }
    })
        .delete(async (req, res) => {
        const Log = log.stackLogger("login.route('/profile/lists').delete");
        Log("req.user", req.user);
        try {
            const dbRes = await list_1.default.deleteMany({ user: req.user?.id }).exec();
            Log("dbRes", dbRes);
            res.json(dbRes);
        }
        catch (e) {
            Log.error("err", e);
            res.sendStatus(api_1.HTTPStatusCode["Bad Request"]);
        }
    });
    login
        .route("/profile/lists/id/:id")
        .patch(async (req, res) => {
        const Log = log.stackLogger("login.route('/profile/lists/id/:id').patch");
        Log("req.params", req.params, "req.user", req.user);
        try {
            const dbRes = await list_1.default.updateOne({
                _id: req.params.id,
                user: req.user?.id
            }, {
                $set: { parts: req.body.parts }
            }).exec();
            Log("dbRes", dbRes);
            res.json(dbRes);
        }
        catch (e) {
            Log.error("err", e);
            res.sendStatus(api_1.HTTPStatusCode["Bad Request"]);
        }
    })
        .delete(async (req, res) => {
        const Log = log.stackLogger("login.route('/profile/lists/id/:id').delete");
        Log("req.body", req.body, "req.params", req.params, "req.user", req.user);
        try {
            const dbUserRes = await user_1.default.findById(req.user?.id).exec();
            Log("dbUserRes before", dbUserRes);
            if (!dbUserRes)
                return res.sendStatus(api_1.HTTPStatusCode["Not Found"]);
            if (!dbUserRes.lists)
                return res.sendStatus(api_1.HTTPStatusCode["Not Found"]);
            dbUserRes.lists = dbUserRes.lists.filter(listId => !listId.equals(req.params.id));
            dbUserRes.save();
            Log("dbUserRes after", dbUserRes);
            const dbListRes = await list_1.default.deleteOne({
                _id: req.params.id,
                user: req.user?.id
            }).exec();
            Log("dbListRes", dbListRes);
            res.json(dbListRes);
        }
        catch (e) {
            Log.error("err", e);
            res.sendStatus(api_1.HTTPStatusCode["Bad Request"]);
        }
    });
    login
        .route("/profile")
        .patch(async (req, res) => {
        const Log = log.stackLogger("login.route('/profile').patch");
        Log("req.body", req.body, "req.params", req.params, "req.user", req.user);
        try {
            const { username, password } = validateUserPass(req.body);
            const dbRes = await user_1.default.updateOne({ _id: req.user?.id }, {
                $set: {
                    username: username,
                    password: await passwordHash(password)
                }
            }).exec();
            Log("dbRes", dbRes);
            res.json(dbRes);
        }
        catch (e) {
            Log.error("err", e);
            res.sendStatus(api_1.HTTPStatusCode["Bad Request"]);
        }
    })
        .delete(async (req, res) => {
        const Log = log.stackLogger("login.route('/profile').delete");
        Log("req.user", req.user, "req.body", req.body);
        try {
            let dbListRes;
            if (req.body.keepLists) {
                dbListRes = await list_1.default.updateMany({ user: req.user?.id }, { $unset: { user: "" } }).exec();
            }
            else
                dbListRes = await list_1.default.deleteMany({ user: req.user?.id }).exec();
            Log("dbListRes", dbListRes);
            const dbUserRes = await user_1.default.deleteOne({ _id: req.user?.id }).exec();
            Log("dbUserRes", dbUserRes);
            res.json(dbUserRes);
            const dbRes = await logoutJWT(req.authInfo?.token);
            Log("new Logouts dbRes", dbRes);
        }
        catch (e) {
            Log.error("err", e);
            res.sendStatus(api_1.HTTPStatusCode["Bad Request"]);
        }
    });
})
    .catch(reason => {
    log.error("mongooseConnectPromise.catch", "err", `\n\tERROR!:\n${reason}`);
    login.use((_req, res) => {
        log.error(["mongooseConnectPromise.catch", "login.use"], "err", `\n\tERROR! No MongoDB available.\nError:\n${reason}`.repeat(20));
        res.sendStatus(api_1.HTTPStatusCode["Service Unavailable"]);
    });
});
//# sourceMappingURL=login.js.map