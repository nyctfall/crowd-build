import express from "express"
import passport from "passport"
import passportJWT from "passport-jwt"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { dbgLog, HTTPStatusCode, SessionType } from "~types/api"
import { mongooseConnectPromise } from "./database"
import Users, { UserType } from "./models/user"
import Lists from "./models/list"
import Logouts from "./models/logouts"

/**
 * @file Handles user account sign-in.
 */

/**
 * Login hanlding Express Router, has session and JWT middleware.
 */
const login = express.Router()

// add custom props to express-session types:
declare global {
  interface JWTInfo {
    token: string
    jwtPayload: jwt.JwtPayload
  }
  namespace Express {
    interface User extends InstanceType<typeof Users> {}
    interface AuthInfo extends JWTInfo {}
  }
}

// SECRET should be defined in "(PROJECT_ROOT)/.env":
const { SECRET = "" } = process.env

// debug message for missing .env file or definition of SECRET:
if (!SECRET) console.error(`\n\tERROR! Error: SECRET should be defined in ".env" file.`.repeat(10))

// debugging logger:
const log = dbgLog.fileLogger("login.ts")

/**
 * TTL maxAge for JWT, sessions, and cookies in ms, 10 min.
 */
const maxAge = 1000 * 60 * 10

/**
 * JWT signing async Promise.
 */
const jwtSign = (payload: jwt.JwtPayload & { id: string }) =>
  new Promise<string>((resolve, reject) =>
    jwt.sign(
      payload,
      SECRET,
      {
        expiresIn: `${maxAge}ms`,
        subject: payload.id
      },
      (err, token) => (err ? reject(err) : resolve(token as string))
    )
  )

/**
 * JWT 'jwt' cookie setting helper.
 */
const setJWTCookie = (res: express.Response, token: string) =>
  res.cookie("jwt", token, {
    expires: new Date(Date.now() + maxAge),
    httpOnly: false
  })

/**
 * bcrypt helper for hashing passwords.
 */
const passwordHash = (password: string) => bcrypt.hash(password, 10)

/**
 * Helper for validating usernames and passwords.
 */
const validateUserPass = (reqBody: express.Request["body"]) => {
  const { username, password } = reqBody

  log("validateUserPass", "username", username, "password", password)

  // ensure username and password received:
  if (!username) throw Error("username not defined in request")
  if (!password) throw Error("password not defined in request")

  // validate input, type:
  if (typeof username !== "string") throw Error("username not string")
  if (typeof password !== "string") throw Error("password not string")

  // validate input, valid characters, no ASCII control chars:
  if (username.match(/([^\u0020-\uFFFF])+/giu)) throw Error("username has invalid ASCII control characters")
  if (password.match(/([^\u0020-\uFFFF])+/giu)) throw Error("password has invalid ASCII control characters")

  return {
    username,
    password
  }
}

/**
 * Helper for logging out JWT tokens.
 */
const logoutJWT = (token: string) => {
  // jwt was already validated, so just get the payload:
  const payload = jwt.decode(token) as jwt.JwtPayload

  // expire time of db entry should be when JWT token is no longer valid:
  let expireAt: Date

  // token has exp field:
  if (payload?.exp) expireAt = new Date(payload.exp * 1000 /* convert sec to ms */)
  // token was signed by SECRET, so it probably has the same exp:
  else expireAt = new Date(Date.now() + maxAge)

  // add token to db of invalid tokens:
  const dbRes = new Logouts({ token, expireAt }).save()

  log("logoutJWT", "payload", payload, "expireAt", expireAt, "dbRes", dbRes)

  return dbRes
}

/**
 * JWT token extractor from Authorization header:
 */
const authHeaderExtractor: passportJWT.JwtFromRequestFunction = req => {
  const Log = log.stackLogger("authHeaderExtractor")

  Log("req.headers", req.headers, "req.headers.authorization", req.headers?.authorization)

  // search request auth header for token:
  if (req && req.headers && req.headers.authorization) {
    // split on space for jwt in auth params:
    const auth = req.headers.authorization?.split(/\s+/)

    // no token found in auth header:
    if (auth.length < 2) return null

    // jwt from header:
    let token = auth[1]

    Log("auth", auth, "token", token, "jwt", jwt.decode(token, { complete: true }))

    // token is in Auth header:
    return token
  }

  // jwt token is null if not present in auth header:
  return null
}

/**
 * JWT token extractor from a Cookie:
 */
const cookieExtractor: passportJWT.JwtFromRequestFunction = req => {
  const Log = log.stackLogger("cookieExtractor")

  Log("req.cookies", req.cookies)

  // search request cookies for token:
  if (req && req.cookies && typeof req.cookies["jwt"] === "string") {
    const token = req.cookies["jwt"]

    Log("token", token, "jwt", jwt.decode(token, { complete: true }))

    // token is in cookie:
    return token
  }

  // jwt token is null if not in cookie:
  return null
}

/**
 * Passport-JWT extractor.
 */
const JWTExtractor = passportJWT.ExtractJwt.fromExtractors([authHeaderExtractor, cookieExtractor])

/**
 * Passport-JWT strategy options.
 */
const JWTStratOpts: passportJWT.StrategyOptions = {
  secretOrKey: SECRET,
  passReqToCallback: true,
  jwtFromRequest: JWTExtractor
}

/**
 * Passport-JWT verify callback.
 */
const JWTStratVerify: passportJWT.VerifyCallbackWithRequest = async (
  req,
  jwtPayload: jwt.JwtPayload,
  done: passportJWT.VerifiedCallback
) => {
  const Log = log.stackLogger("JWTStratVerifyCb")

  // get token to check if token is logged out:
  const token = JWTExtractor(req) as string

  Log("jwtPayload", jwtPayload, "jwt", jwt.decode(token, { complete: true }))

  try {
    // make sure token was not logged out previously:
    const dbRes = await Logouts.findOne({ token }).exec()

    Log("Logouts dbRes", dbRes)

    // token was logged out and is invalid:
    if (dbRes) return done(null, false)
  } catch (e) {
    Log.error("Logouts.findOne error", e)

    // error searching db to check if token is logged out:
    done(e, false)
  }

  try {
    // find user:
    const user = await Users.findById(jwtPayload.id).exec()

    Log("user", user)

    // user found:
    if (user) return done(null, user, { token, jwtPayload })

    try {
      // user doesn't exist, logout the token for non-existant user:
      const dbRes = await logoutJWT(token)

      Log("new Logouts dbRes", dbRes)

      // no user found:
      done(null, false)
    } catch (e) {
      Log.error("new Logouts error", e)

      // error logging out token for user that doesn't exist:
      done(e, false)
    }
  } catch (e) {
    Log.error("Users.findOne error", e)

    // error finding user:
    done(e, false)
  }
}

/**
 * Passport-JWT Strategy.
 */
const JWTStrat = new passportJWT.Strategy(JWTStratOpts, JWTStratVerify)

/**
 * Passport initializer Express middleware.
 */
const passportInit = passport.initialize({ userProperty: "user" })

login.use(passportInit)

// use JWT stategy in passport:
passport.use("jwt", JWTStrat)

// serialize user to express session:
passport.serializeUser(async (user, done) => {
  log("passport.serializeUser", "user", user)

  done(null, user.id)
})

// deserialize user from express session:
passport.deserializeUser(async (id: string, done) => {
  const Log = log.stackLogger("passport.deserializeUser")

  Log("id", id)

  try {
    // parse json, will throw if undefined:
    const user = await Users.findById(id).exec()

    Log("user", user)

    // user should be an object, and not null:
    if (user) return done(null, user)

    // user not found:
    done(null, false)
  } catch (e) {
    Log.error("Users.findById error", e)

    done(e, false)
  }
})

// requires db:
mongooseConnectPromise
  .then(mongoose => {
    console.log("\n\t> Login Session ready...")

    // check login for auth to use user profile:
    login.use(["/profile", "/profile/*", "/logout"], passport.authenticate("jwt", { session: false }))

    // logging middleware:
    login.use((req, _res, next) => {
      // prettier-ignore
      log("login.use",
      "req.user", req.user,
      "req.authInfo", req.authInfo,
      "req.isAuthenticated()", req.isAuthenticated?.(),
      "req.isUnauthenticated()", req.isUnauthenticated?.()
    )

      next()
    })

    // login route, send JWT token is responce and cookie:
    login.post("/login", async (req, res) => {
      const Log = log.stackLogger("login.post('/login')")

      Log("req.body", req.body)

      // get username and password:
      const { username, password } = validateUserPass(req.body)

      try {
        // look for existing user:
        const user = await Users.findOne({ username }).exec()

        Log("user", user)

        // return and send responce of nonexistant user:
        if (!user)
          return res.status(HTTPStatusCode["Not Found"]).json({
            success: false,
            nonexistant: true
          } as SessionType)

        // compare hashes to check password is user's password:
        const psswdComp = await bcrypt.compare(password, user.password)

        // prettier-ignore
        Log(
        "password", password,
        // "passswordHash", passwordHash,
        // const passwordHash = await bcrypt.hash(password, (user.password.match(/\$.*\$.*\$.{22}/) ?? [""])[0])
        "user.password", user.password,
        "psswdComp", psswdComp
      )

        // return and send responce of wrong password to user:
        if (!psswdComp)
          return res.status(HTTPStatusCode["Unauthorized"]).json({
            success: false,
            conflict: true,
            incorrect: ["password"]
          } as SessionType)

        // signin JWT token:
        const token = await jwtSign({ id: user.id })

        Log("token", token)

        // set JWT in cookie:
        setJWTCookie(res, token)

        // respond with success:
        res.json({
          success: true,
          user,
          token
        } as { user: UserType } & Omit<SessionType, "user">)
      } catch (e) {
        Log.error("err", e)

        // bad request:
        res.send(400).json({ success: false } as SessionType)
      }
    })

    // signup route, creates user in db and logs in:
    login.post("/signup", async (req, res) => {
      const Log = log.stackLogger("login.post('/signup')")

      Log("req.body", req.body)

      try {
        // get username and password:
        const { username, password } = validateUserPass(req.body)

        // check for pre-existing user name:
        const userTaken = await Users.findOne({ username }).exec()

        Log("userTaken", userTaken)

        // return and send responce of username already in use:
        if (userTaken)
          return res.status(HTTPStatusCode["Conflict"]).json({
            success: false,
            conflict: true,
            preexisting: ["username"]
          } as SessionType)

        // create new user:
        const newUser = await new Users({
          username,
          password: await passwordHash(password)
        }).save()

        Log("newUser", newUser)

        // signin JWT token:
        const token = await jwtSign({ id: newUser.id })

        Log("token", token)

        // set JWT in cookie:
        setJWTCookie(res, token)

        // respond with success:
        res.status(HTTPStatusCode["Created"]).json({
          success: true,
          user: newUser.toObject(),
          token
        } as SessionType)
      } catch (e) {
        Log.error("err", e)

        // bad request:
        res.send(400).json({ success: false } as SessionType)
      }
    })

    // logout route, add JWT token to db of logged out tokens:
    login.post("/logout", async (req, res) => {
      const Log = log.stackLogger("login.post('/logout')")

      Log("req.authInfo", req.authInfo, "maxAge", maxAge)

      try {
        // add token to db of invalid tokens:
        const dbRes = await logoutJWT(req.authInfo?.token as string)

        Log("new Logouts dbRes", dbRes)

        // token was saved to log out db:
        if (dbRes) return res.send({ success: true } as SessionType)

        // log out db did not save token:
        res.status(HTTPStatusCode["Internal Server Error"]).send({ success: false } as SessionType)
      } catch (e) {
        Log.error("new Logouts error", e)

        // token was not deleted:
        res.status(HTTPStatusCode["Internal Server Error"]).send({ success: false } as SessionType)
      }
    })

    // modify user owned lists:
    login
      .route("/profile/lists")
      // get user owned lists:
      .get(async (req, res) => {
        const Log = log.stackLogger("login.route('/profile/lists').get")

        Log("req.query", req.query)

        // skip certain number of newest stories:
        const offset = Number(req.query.offset ?? 0)

        // only get limited number of stories:
        const limit = Number(req.query.limit ?? Infinity)

        Log("offset", offset, "limit", limit)

        try {
          // get users lists:
          const dbRes = await Lists.find({ user: req.user?.id })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .exec()

          Log("dbRes", dbRes)

          // if there was no error, return result, which could be an empty array:
          if (dbRes.length > 0) res.json(dbRes)
          // if empty array, not parts were found:
          else res.status(HTTPStatusCode["Not Found"]).json(dbRes)
        } catch (e) {
          Log.error("err", e)

          // bad request:
          res.sendStatus(HTTPStatusCode["Bad Request"])
        }
      })
      // save a user owned list:
      .post(async (req, res) => {
        const Log = log.stackLogger("login.route('/profile/lists').post")

        Log("req.body", req.body, "req.user", req.user)

        try {
          /** @todo input validation */
          // save new list:
          const newList = await new Lists({
            parts: req.body.parts,
            user: req.user?.id
          }).save()

          Log("newList", newList)

          // db error:
          if (!newList) return res.sendStatus(HTTPStatusCode["Internal Server Error"])

          // save list id to user:
          const user = await Users.findById(req.user?.id).exec()

          Log("mongo user before", user?.toJSON())

          // don't save to user if user was not found:
          if (!user) {
            // remove user owner field from document:
            await newList.update({ $unset: { user: "" } })

            // list was saved, but not owned by user:
            return res.status(HTTPStatusCode["Not Found"]).json(newList)
          }

          // check for lists prop, and save new list:
          if (user.lists) user.lists.push(newList.id)
          else user.lists = [newList.id]

          // save to db:
          await user.save()

          // return all info from updated user:
          Log("mongo user after", (await user.populate("lists")).toJSON())

          // return added list:
          res.status(HTTPStatusCode["Created"]).json(newList)
        } catch (e) {
          Log.error("err", e)

          // bad request:
          res.sendStatus(HTTPStatusCode["Bad Request"])
        }
      })
      // delete all user owned lists:
      .delete(async (req, res) => {
        const Log = log.stackLogger("login.route('/profile/lists').delete")

        Log("req.user", req.user)

        try {
          // delete all lists owned by user:
          const dbRes = await Lists.deleteMany({ user: req.user?.id }).exec()

          Log("dbRes", dbRes)

          res.json(dbRes)
        } catch (e) {
          Log.error("err", e)

          // bad request:
          res.sendStatus(HTTPStatusCode["Bad Request"])
        }
      })

    // modify one specific user owned list:
    login
      .route("/profile/lists/id/:id")
      // edit parts in user owned list:
      .patch(async (req, res) => {
        const Log = log.stackLogger("login.route('/profile/lists/id/:id').patch")

        Log("req.params", req.params, "req.user", req.user)

        try {
          // only edit list owned by user:
          const dbRes = await Lists.updateOne(
            {
              _id: req.params.id,
              user: req.user?.id
            },
            {
              $set: { parts: req.body.parts }
            }
          ).exec()

          Log("dbRes", dbRes)

          res.json(dbRes)
        } catch (e) {
          Log.error("err", e)

          // bad request:
          res.sendStatus(HTTPStatusCode["Bad Request"])
        }
      })
      // delete one specific user owned list:
      .delete(async (req, res) => {
        const Log = log.stackLogger("login.route('/profile/lists/id/:id').delete")

        Log("req.body", req.body, "req.params", req.params, "req.user", req.user)

        try {
          // get user:
          const dbUserRes = await Users.findById(req.user?.id).exec()

          Log("dbUserRes before", dbUserRes)

          /** @todo improve handling for missing user, when deleted in another session. */
          // user not found:
          if (!dbUserRes) return res.sendStatus(HTTPStatusCode["Not Found"])
          // user owned lists not found:
          if (!dbUserRes.lists) return res.sendStatus(HTTPStatusCode["Not Found"])

          /** @todo improve handling for errors. */
          // remove deleted list from user lists:
          dbUserRes.lists = dbUserRes.lists.filter(listId => !listId.equals(req.params.id))

          // save user with updated lists:
          dbUserRes.save()

          Log("dbUserRes after", dbUserRes)

          /** @todo improve handling for missing list. */
          const dbListRes = await Lists.deleteOne({
            _id: req.params.id,
            user: req.user?.id
          }).exec()

          Log("dbListRes", dbListRes)

          res.json(dbListRes)
        } catch (e) {
          Log.error("err", e)

          // bad request:
          res.sendStatus(HTTPStatusCode["Bad Request"])
        }
      })

    // edit user profile settings:
    login
      .route("/profile")
      // edit username or password:
      .patch(async (req, res) => {
        const Log = log.stackLogger("login.route('/profile').patch")

        Log("req.body", req.body, "req.params", req.params, "req.user", req.user)

        try {
          // get username and password:
          const { username, password } = validateUserPass(req.body)

          /** @todo improve handling for errors. */
          const dbRes = await Users.updateOne(
            { _id: req.user?.id },
            {
              $set: {
                username: username,
                password: await passwordHash(password)
              }
            }
          ).exec()

          Log("dbRes", dbRes)

          /** @todo improve responce codes for failed updates. */
          res.json(dbRes)
        } catch (e) {
          Log.error("err", e)

          // bad request:
          res.sendStatus(HTTPStatusCode["Bad Request"])
        }
      })
      // delete user and all user owned lists:
      .delete(async (req, res) => {
        const Log = log.stackLogger("login.route('/profile').delete")

        Log("req.user", req.user, "req.body", req.body)

        try {
          let dbListRes: Awaited<ReturnType<ReturnType<typeof Lists.updateMany | typeof Lists.deleteMany>["exec"]>>

          // disown all user owned lists:
          if (req.body.keepLists) {
            dbListRes = await Lists.updateMany({ user: req.user?.id }, { $unset: { user: "" } }).exec()
          }
          // delete all user owned lists:
          else dbListRes = await Lists.deleteMany({ user: req.user?.id }).exec()

          Log("dbListRes", dbListRes)

          /** @todo improve handling for missing user, when deleted in another session. */
          /** @todo improve handling for errors. */
          // delete user:
          const dbUserRes = await Users.deleteOne({ _id: req.user?.id }).exec()

          Log("dbUserRes", dbUserRes)

          // return successful deletion:
          res.json(dbUserRes)

          // invalidate token by adding token to db of invalid tokens:
          const dbRes = await logoutJWT(req.authInfo?.token as string)

          Log("new Logouts dbRes", dbRes)
        } catch (e) {
          Log.error("err", e)

          // bad request:
          res.sendStatus(HTTPStatusCode["Bad Request"])
        }
      })
  })
  .catch(reason => {
    log.error("mongooseConnectPromise.catch", "err", `\n\tERROR!:\n${reason}`)

    // no mongoDB available, cannot process logins:
    login.use((_req, res) => {
      log.error(
        ["mongooseConnectPromise.catch", "login.use"],
        "err",
        `\n\tERROR! No MongoDB available.\nError:\n${reason}`.repeat(20)
      )

      res.sendStatus(HTTPStatusCode["Service Unavailable"])
    })
  })

export { login }
