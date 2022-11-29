"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passportSession = exports.passportInit = exports.loginSession = exports.login = void 0;
const node_path_1 = __importDefault(require("node:path"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const api_1 = require("~types/api");
const database_1 = require("./database");
const user_1 = __importDefault(require("./models/user"));
const list_1 = __importDefault(require("./models/list"));
const login = express_1.default.Router();
exports.login = login;
const log = (0, api_1.dbgFileLogger)("login.ts");
const maxAge = 1000 * 60 * 10;
const { SECRET = "" } = process.env;
if (!SECRET)
    console.error(`\n\tERROR! Error: SECRET should be defined in (PROJECT_ROOT)/.env,\n\tmissing: "${node_path_1.default.resolve(__dirname, "../.env").repeat(10)}"`);
const store = connect_mongo_1.default.create({
    client: database_1.mongooseConnection.getClient(),
    ttl: maxAge,
    autoRemoveInterval: 1
});
store.on("set", (sessionId, session) => log("mongoStore.on(\"set\")", "sessionId", sessionId, "session", session));
store.on("touch", (sessionId, session) => log("mongoStore.on(\"touch\")", "sessionId", sessionId, "session", session));
store.on("create", (sessionId, session) => log("mongoStore.on(\"create\")", "sessionId", sessionId, "session", session));
store.on("update", (sessionId, session) => log("mongoStore.on(\"update\")", "sessionId", sessionId, "session", session));
store.on("destroy", (sessionId, session) => log("mongoStore.on(\"destroy\")", "sessionId", sessionId, "session", session));
const loginSession = (0, express_session_1.default)({
    store,
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
    name: "connect.sid",
    cookie: {
        httpOnly: false,
        maxAge
    }
});
exports.loginSession = loginSession;
login.use(loginSession);
const passportInit = passport_1.default.initialize({
    userProperty: "user"
});
exports.passportInit = passportInit;
login.use(passportInit);
const passportSession = passport_1.default.session();
exports.passportSession = passportSession;
login.use(passportSession);
const cookieExtractor = req => {
    if (req && req.cookies && typeof req.cookies.jwt === "string")
        return req.cookies.jwt;
    return null;
};
passport_1.default.use("jwt", new passport_jwt_1.default.Strategy({
    secretOrKey: SECRET,
    jsonWebTokenOptions: {
        maxAge
    },
    jwtFromRequest: passport_jwt_1.default.ExtractJwt.fromExtractors([passport_jwt_1.default.ExtractJwt.fromAuthHeaderAsBearerToken(), cookieExtractor])
}, async (jwtPayload, done) => {
    try {
        const Log = log.stackLogger(["passport.use", "passportJWT.Strategy", `VerifyCallback(${jwtPayload})`]);
        Log("jwtPayload", jwtPayload);
        const user = await user_1.default.findOne({ _id: jwtPayload.id }).exec();
        Log("user", user);
        if (user)
            done(null, user);
        else
            done(null, false);
    }
    catch (err) {
        console.error(err);
        done(err, false);
    }
}));
passport_1.default.serializeUser(async (user, done) => {
    done(null, user?.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const Log = log.stackLogger("passport.deserializeUser");
        Log("id", id);
        const user = await user_1.default.findById(id).exec();
        Log("id", id, "user", user);
        if (user)
            done(null, user);
        else
            done(null, false);
    }
    catch (err) {
        console.error(err);
        done(err, false);
    }
});
login.use((req, _res, next) => {
    log("login.use", "req.account", req.account, "req.user", req.user, "req.authInfo", req.authInfo, "req.sessionID", req.sessionID, "req.session", req.session, "req.isAuthenticated?.()", req.isAuthenticated?.(), "req.isUnauthenticated?.()", req.isUnauthenticated?.(), "req.sessionStore", req.sessionStore);
    next();
});
database_1.mongooseConnectPromise
    .then(() => {
    console.log("\n\t> Login Session ready...");
    const jwtSign = (payload) => new Promise((resolve, reject) => jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn: maxAge }, (err, token) => err ? reject(err) : resolve(token)));
    login.post("/login", passport_1.default.authenticate("jwt", { successRedirect: "/api/v1/profile", session: true }), async (req, res) => {
        try {
            const Log = log.stackLogger(["mongooseConnectPromise.then", "login.post('/login')"]);
            const { username, password } = req.body;
            Log("username", username, "password", password);
            const user = await user_1.default.findOne({ username }).exec();
            Log("user", user);
            if (!user)
                return res.status(404).json({
                    success: false,
                    nonexistant: true
                });
            if (await bcrypt_1.default.compare(password, user.password))
                return res.status(401).json({
                    success: false,
                    conflict: true,
                    incorrect: ["password"]
                });
            const token = await jwtSign({ id: user.id, username: user.username });
            req.session.token = token;
            Log("token", token, "req.session.token", req.session.token);
            res.json({
                success: true,
                user,
                token
            });
            req.login(user, { session: true }, (err) => {
                console.error(err);
            });
        }
        catch (e) {
            console.error(e);
            res.sendStatus(400);
        }
    });
    login.post("/signup", passport_1.default.authenticate("jwt", { successRedirect: "/api/v1/profile", session: true }), async (req, res) => {
        try {
            const Log = log.stackLogger(["mongooseConnectPromise.then", "login.post('/signup')"]);
            const { username, password } = req.body;
            Log("username", username, "password", password);
            const userTaken = await user_1.default.find({ username }).exec();
            Log("userTaken", userTaken);
            if (userTaken.length > 0) {
                res.status(409).json({ success: false, conflict: true, preexisting: ["username"] });
                return;
            }
            const newUser = await new user_1.default({
                username,
                password: await bcrypt_1.default.hash(password, 10)
            }).save();
            Log("newUser", newUser);
            const token = await jwtSign({ id: newUser.id, username: newUser.username });
            req.session.token = token;
            Log("token", token, "req.session.token", req.session.token);
            res.json({ success: true, user: newUser.toObject(), token });
            req.login(newUser, { session: true }, (err) => {
                console.error(err);
            });
        }
        catch (e) {
            console.error(e);
            res.sendStatus(400);
        }
    });
    login.post("/logout", passport_1.default.authenticate("jwt", { session: true }), async (req, res) => {
        try {
            const Log = log.stackLogger(["mongooseConnectPromise.then", "login.post('/logout')"]);
            Log("req.session", req.session, "req.session.token", req.session.token);
            req.logout((err) => {
                if (err) {
                    console.error(err);
                    res.status(500).send({ success: false });
                }
                res.send({ success: true });
            });
        }
        catch (err) {
            console.error(err);
            res.status(500).send({ success: false });
        }
    });
    login.use(["/profile", "/profile/*"], passport_1.default.authenticate("jwt", {
        session: true,
        failureRedirect: "/api/v1/login"
    }));
    login.route("/profile/lists")
        .get(async (req, res) => {
        try {
            const Log = log.stackLogger(["mongooseConnectPromise.then", "login.route('/profile/lists').get"]);
            const offset = Number(req.query.offset ?? 0);
            const limit = Number(req.query.limit ?? 1);
            Log("offset", offset, "limit", limit);
            const dbRes = await list_1.default.find({ user: req.user?.id }).sort({ createdAt: -1 }).skip(offset).limit(limit).exec();
            Log("dbRes", dbRes);
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
            const Log = log.stackLogger(["mongooseConnectPromise.then", "login.route('/profile/lists').post"]);
            const newList = await new list_1.default({ parts: req.body.parts, user: req.user?.id }).save();
            Log("newList", newList);
            const user = await user_1.default.findById(req.user?.id).exec();
            Log("mongo user before", user?.toJSON());
            if (!user)
                return res.json(newList);
            if (user.lists)
                user.lists.push(newList.id);
            else
                user.lists = [newList.id];
            await user.save();
            Log("mongo user after", (await user.populate("lists")).toJSON());
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
            const Log = log.stackLogger(["mongooseConnectPromise.then", "login.route('/profile/lists').delete"]);
            const dbRes = await list_1.default.deleteMany({ user: req.user?.id }).exec();
            Log("dbRes", dbRes);
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
    login.route("/profile/lists/id/:id")
        .patch(async (req, res) => {
        try {
            const Log = log.stackLogger(["mongooseConnectPromise.then", "login.route('/profile/lists/id/:id').patch"]);
            Log("req.params", req.params, "req.user", req.user);
            const dbRes = await list_1.default.updateOne({
                _id: req.params.id, user: req.user?.id
            }, {
                $set: { parts: req.body.parts }
            }).exec();
            Log("dbRes", dbRes);
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
            const Log = log.stackLogger(["mongooseConnectPromise.then", "login.route('/profile/lists/id/:id').delete"]);
            Log("req.body", req.body, "req.params", req.params, "req.user", req.user);
            const dbUserRes = await user_1.default.findById(req.user?.id).exec();
            Log("dbUserRes before", dbUserRes);
            if (dbUserRes && dbUserRes.lists) {
                dbUserRes.lists = dbUserRes.lists.filter(listId => !listId.equals(req.params.id));
                dbUserRes.save();
                Log("dbUserRes after", dbUserRes);
            }
            const dbListRes = await list_1.default.deleteOne({ _id: req.params.id, user: req.user?.id }).exec();
            Log("dbListRes", dbListRes);
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
    login.route("/profile")
        .patch(async (req, res) => {
        try {
            const Log = log.stackLogger(["mongooseConnectPromise.then", "login.route('/profile').patch"]);
            Log("req.body", req.body, "req.params", req.params, "req.user", req.user);
            const dbRes = await user_1.default.updateOne({
                _id: req.user?.id
            }, {
                $set: { username: req.body.username }
            }).exec();
            Log("dbRes", dbRes);
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
            const Log = log.stackLogger(["mongooseConnectPromise.then", "login.route('/profile').delete"]);
            Log("req.user", req.user);
            const dbListRes = await list_1.default.deleteMany({ user: req.user?.id }).exec();
            Log("dbListRes", dbListRes);
            const dbUserRes = await user_1.default.deleteOne({ _id: req.user?.id }).exec();
            Log("dbUserRes", dbUserRes);
            res.json(dbUserRes);
            req.logout({ keepSessionInfo: false }, (err) => {
                console.error(err);
            });
        }
        catch (e) {
            console.error(e);
            res.sendStatus(400);
        }
    });
})
    .catch((reason) => {
    console.error(`\n\tERROR!:\n${reason}`);
    login.use((_req, res) => {
        console.error(`\n\tERROR! No MongoDB available.\nError:\n${reason}`.repeat(20));
        res.sendStatus(503);
    });
});
//# sourceMappingURL=login.js.map