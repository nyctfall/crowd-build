import path from "node:path"
import express from "express"
import session from "express-session"
import mongoStore from "connect-mongo"
import passport from "passport"
import passportJWT from "passport-jwt"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { dbgLog, dbgFileLogger, SessionType } from "~types/api"
import { mongooseConnection, mongooseConnectPromise } from "./database"
import Users, { UserType } from "./models/user"
import Lists from "./models/list"


// add custom prop types
declare module "express-session" {
  interface SessionData {
    token: string;
  }
}
declare global {
  namespace Express {
    interface User extends InstanceType<typeof Users> {}
  }
}

/**
 * @file Handles user account sign-in.
 */


/**
 * Login hanlding Express Router, has session and JWT middleware.
 */
const login = express.Router()


// dbg logger:
const log = dbgFileLogger("login.ts")


/** 
 * TTL maxAge for JWT, sessions, and cookies in ms, 10 min.
 */ 
const maxAge = 1000 * 60 * 10


// SECRET should be defined in "(PROJECT_ROOT)/.env":
const { SECRET = "" } = process.env


// debug message for missing .env file or definition of SECRET:
if (!SECRET) console.error(`\n\tERROR! Error: SECRET should be defined in (PROJECT_ROOT)/.env,\n\tmissing: "${path.resolve(__dirname, "../.env").repeat(10)}"`)


/**
 * mongoDB store for express session:
 */
const store = mongoStore.create({
  client: mongooseConnection.getClient(),
  // cookie expiration in ms:
  ttl: maxAge,
  // remove sessions every min:
  autoRemoveInterval: 1
})

// // event listeners for debug:
store.on("set", (sessionId, session) => log("mongoStore.on(\"set\")", "sessionId", sessionId, "session", session))
store.on("touch", (sessionId, session) => log("mongoStore.on(\"touch\")", "sessionId", sessionId, "session", session))
store.on("create", (sessionId, session) => log("mongoStore.on(\"create\")", "sessionId", sessionId, "session", session))
store.on("update", (sessionId, session) => log("mongoStore.on(\"update\")", "sessionId", sessionId, "session", session))
store.on("destroy", (sessionId, session) => log("mongoStore.on(\"destroy\")", "sessionId", sessionId, "session", session))


/** 
 * Express server-side session middleware. 
 */ 
const loginSession = session({
  store,
  secret: SECRET,
  resave: false,
  saveUninitialized: true, // if true, this website uses cookies...
  name: "connect.sid",
  // use for re-setting the cookie and maxAge every respone:
  // rolling: true,
  cookie: {
    // client side JS should be able to access session cookie:
    httpOnly: false,
    // in production only use cookie with HTTPS:
    // secure: true,
    // TTL for the cookie on client, for sessoin expiration after time in ms, can be reset using session.touch(newMaxAge):
    maxAge
  }
})

login.use(loginSession)

/** 
 * Passport initializer Express middleware.
 */ 
const passportInit = passport.initialize({
  userProperty: "user"
})

login.use(passportInit)

/** 
 * Passport Express session authentication strategy Express middleware.
 */
const passportSession = passport.session()

login.use(passportSession)


/** 
 * JWT token extractor from a Cookie:
 */
const cookieExtractor: passportJWT.JwtFromRequestFunction = req => {  
  // search request cookies for token:
  if (req && req.cookies && typeof req.cookies.jwt === "string") return req.cookies.jwt
  
  // jwt token is null if not in cookie:
  return null
}

// use JWT stategy in passport:
passport.use("jwt", new passportJWT.Strategy({
    secretOrKey: SECRET,
    jsonWebTokenOptions: {
      // TTL in ms:
      maxAge
    },
    jwtFromRequest: passportJWT.ExtractJwt.fromExtractors([passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(), cookieExtractor])
  }, 
  async (jwtPayload: jwt.JwtPayload, done: passportJWT.VerifiedCallback) => {
    try {
      const Log = log.stackLogger(["passport.use", "passportJWT.Strategy", `VerifyCallback(${jwtPayload})`])
      
      Log("jwtPayload", jwtPayload)

      // find user:
      const user = await Users.findOne({ _id: jwtPayload.id }).exec()

      Log("user", user)
      
      // user found:
      if (user) done(null, user)
      // user doesn't exist:
      else done(null, false)
    } catch (err){
      console.error(err)

      // error finding user:
      done(err, false)
    }
}))


// serialize user to express session:
passport.serializeUser(async (user, done) => {
  done(null, (user as any)?.id)
})
  
// deserialize user from express session:
passport.deserializeUser(async (id: string, done) => {
  try {
    const Log = log.stackLogger("passport.deserializeUser")
    
    Log("id", id)

    // parse json, will throw if undefined:
    const user = await Users.findById(id).exec()
    
    Log("id", id, "user", user)
    
    // user should be an object, and not null:
    if (user) done(null, user)
    else done(null, false)
  } catch (err){
    console.error(err)

    done(err, false)
  }
})


// logging middleware:
login.use((req, _res, next) => {
  log("login.use",
    "req.account", (req as any).account, 
    "req.user", req.user, 
    "req.authInfo", req.authInfo,
    "req.sessionID", req.sessionID, 
    "req.session", req.session,
    "req.isAuthenticated?.()", req.isAuthenticated?.(),
    "req.isUnauthenticated?.()", req.isUnauthenticated?.(),
    "req.sessionStore", req.sessionStore, 
  )
  
  next()
})


// requires db:
mongooseConnectPromise
.then(() => {
  console.log("\n\t> Login Session ready...")


  // jwt signing helper:
  const jwtSign = (payload: jwt.JwtPayload) => new Promise<string>((resolve, reject) => 
    jwt.sign(
      payload, 
      SECRET, 
      { expiresIn: maxAge }, 
      (err, token) => err ? reject(err) : resolve(token as string)
    )
  )
  

  // login route, also logs-in for passport:
  login.post("/login", passport.authenticate("jwt", { successRedirect: "/api/v1/profile", session: true }), async (req, res) => {
    try {
      const Log = log.stackLogger(["mongooseConnectPromise.then","login.post('/login')"])

      const { username, password } = req.body
      

      Log("username", username, "password", password)
      

      // look for existing user:
      const user = await Users.findOne({ username }).exec()
      

      Log("user", user)
      

      // return and send responce of not found user:
      /** @todo improve api responces for incorrect data request. edit of front-end required */
      if (!user) return res.status(404).json({ 
        success: false, 
        nonexistant: true 
      } as SessionType)


      // return and send responce of wrong password to user:
      /** @todo improve api responces for incorrect data request. edit of front-end required */
      if (await bcrypt.compare(password, user.password)) return res.status(401).json({ 
        success: false, 
        conflict: true, 
        incorrect: ["password"] 
      } as SessionType)
      
      // signin JWT token:
      const token = await jwtSign({ id: user.id, username: user.username })
      
      // add to valid array to make sign out work:
      req.session.token = token
      

      Log("token", token, "req.session.token", req.session.token)
      

      // respond with success:
      res.json({ 
        success: true, 
        user, 
        token 
      } as { user: UserType } & Omit<SessionType, "user">)


      // start session:
      req.login(user, { session: true }, (err) => {
        console.error(err)
      })
    } catch (e){
      console.error(e)
      
      // bad request:
      res.sendStatus(400)
    }
  })


  // signup route, creates user in db, also logs-in for passport:
  login.post("/signup", passport.authenticate("jwt", { successRedirect: "/api/v1/profile", session: true }), async (req, res) => {
    try {
      const Log = log.stackLogger(["mongooseConnectPromise.then","login.post('/signup')"])
      
      const { username, password } = req.body


      Log("username", username, "password", password)
      

      // check for pre-existing user name:
      const userTaken = await Users.find({ username }).exec()
      

      Log("userTaken", userTaken)
      

      // return and send responce of problem to user:
      /** @todo improve api responces for incorrect data request. edit of front-end required */
      if (userTaken.length > 0){
        res.status(409).json({ success: false, conflict: true, preexisting: ["username"] } as SessionType)
        return
      }
      
      // create new user:
      const newUser = await new Users({ 
        username, 
        password: await bcrypt.hash(password, 10)
      }).save()
      

      Log("newUser", newUser)
      

      // signin JWT token:
      const token = await jwtSign({ id: newUser.id, username: newUser.username })
      
      // add to valid array to make sign out work:
      req.session.token = token
      

      Log("token", token, "req.session.token", req.session.token)


      // respond with success:
      res.json({ success: true, user: newUser.toObject(), token } as SessionType)

      // start session:
      req.login(newUser, { session: true }, (err) => {
        console.error(err)
      })
    } catch (e){
      console.error(e)
      
      // bad request:
      res.sendStatus(400)
    }
  })


  login.post("/logout", passport.authenticate("jwt", { session: true }), async (req, res) => {
    try {
      const Log = log.stackLogger(["mongooseConnectPromise.then","login.post('/logout')"])
      
        
      Log("req.session", req.session, "req.session.token", req.session.token)
      
  
      // // invalidating the session:
      // req.session.destroy((err) => {
      //   if (err){
      //     console.error(err)
          
      //     // token was not deleted:
      //     res.status(500).send({ success: false } as SessionType)
      //   }

      // logout user:
      req.logout((err) => {
        if (err){
          console.error(err)
          
          // token was not deleted:
          res.status(500).send({ success: false } as SessionType)
        }

        // token was successfully invalidated, didn't exist, or was alredy invalid:
        res.send({ success: true } as SessionType)
      })
      // })
    } catch (err){
      console.error(err)

      // token was not deleted:
      res.status(500).send({ success: false } as SessionType)
    }
  })


  // check login for auth to use user profile:
  login.use(["/profile", "/profile/*"], passport.authenticate("jwt", { 
    session: true,
    failureRedirect: "/api/v1/login"
  }))
  

  login.route("/profile/lists")
  // get all user owned lists:
  .get(async (req, res) => {
    // send all lists owned by user:
    try {
      const Log = log.stackLogger(["mongooseConnectPromise.then","login.route('/profile/lists').get"])
      
      // skip certain number of newest stories:
      const offset = Number(req.query.offset ?? 0)
      
      // only get limited number of stories:
      const limit = Number(req.query.limit ?? 1)


      Log("offset", offset, "limit", limit)
      

      // get users lists:
      const dbRes = await Lists.find({ user: req.user?.id }).sort({ createdAt: -1 }).skip(offset).limit(limit).exec()


      Log("dbRes", dbRes)
      

      if (dbRes != null) res.json(dbRes)
      // bad request:
      else res.sendStatus(404)
    } catch (e) {
      console.error(e)
      
      // bad request:
      res.sendStatus(400)
    }
  })
  // save a user specific list:
  .post(async (req, res) => {
    try {
      const Log = log.stackLogger(["mongooseConnectPromise.then","login.route('/profile/lists').post"])

      // save new list:
      const newList = await new Lists({ parts: req.body.parts, user: req.user?.id }).save()
      

      Log("newList", newList)
      

      // save list id to user:
      const user = await Users.findById(req.user?.id).exec()
      

      Log("mongo user before", user?.toJSON())
      
      
      // don't save to user if user was not found:
      if (!user) return res.json(newList)
      // if (!user) {
      //   res.sendStatus(400)
      //   return
      // }
      
      // check for lists prop, and save new list:
      if (user.lists) user.lists.push(newList.id)
      else user.lists = [newList.id]
      
      
      // save to db:
      await user.save()

      
      // // return all info from updated user:
      Log("mongo user after", (await user.populate("lists")).toJSON())
      

      // // return user with added list:
      // res.json(user)
      if (newList != null) res.json(newList)
      // if (user != null){
      //   res.json(user.lists)
      //   await user.populate("lists")
      // }

      // bad request:
      else res.sendStatus(400)
    } catch (e){
      console.error(e)
      
      // bad request:
      res.sendStatus(400)
    }
  })
  // delete all user specific lists:
  .delete(async (req, res) => {
    // only delete all lists owned by user:
    try {
      const Log = log.stackLogger(["mongooseConnectPromise.then","login.route('/profile/lists').delete"])
      

      // delete user's lists:
      const dbRes = await Lists.deleteMany({ user: req.user?.id }).exec()


      Log("dbRes", dbRes)


      if (dbRes != null) res.json(dbRes)
      // bad request:
      else res.sendStatus(400)
    } catch (e) {
      console.error(e)

      // bad request:
      res.sendStatus(400)
    }
  })


  // modify user specific lists:
  login.route("/profile/lists/id/:id")
  .patch(async (req, res) => {
    // only edit lists not owned by user:
    try {
      const Log = log.stackLogger(["mongooseConnectPromise.then","login.route('/profile/lists/id/:id').patch"])
      

      Log("req.params", req.params, "req.user", req.user)


      /** @todo improve handling for missing list. */
      const dbRes = await Lists.updateOne({ 
          _id: req.params.id, user: req.user?.id 
        }, 
        { 
          $set: { parts: req.body.parts } 
        }
      ).exec()
      // else res.sendStatus(404)
      

      Log("dbRes", dbRes)


      if (dbRes != null) res.json(dbRes)
      // bad request:
      else res.sendStatus(400)
    } catch (e) {
      console.error(e)

      // bad request:
      res.sendStatus(400)
    }
  })
  // delete user specific list:
  .delete(async (req, res) => {
    // only delete list owned by user:
    try {
      const Log = log.stackLogger(["mongooseConnectPromise.then","login.route('/profile/lists/id/:id').delete"])
      
      
      Log("req.body", req.body, "req.params", req.params, "req.user", req.user)
      
      
      const dbUserRes = await Users.findById(req.user?.id).exec()
      
      
      Log("dbUserRes before", dbUserRes)
      
      
      // remove deleted list from user lists:
      /** @todo improve handling for missing user, when deleted in another session. */
      /** @todo improve handling for errors. */
      if (dbUserRes && dbUserRes.lists){        
        dbUserRes.lists = dbUserRes.lists.filter(listId => !listId.equals(req.params.id))
        
        dbUserRes.save()
        
        
        Log("dbUserRes after", dbUserRes)
      }
      // if (dbUser == null) {
      //   const dbListDisownRes = await Lists.modifyOne(
      //     { _id: req.params.id, user: req.user?.id }, 
      //     { $unset: "user" }
      //   ).exec()
      //   res.status(404).json({ user: dbUser, list: dbListDisownRes })
      // }

      /** @todo improve handling for missing list. */
      const dbListRes = await Lists.deleteOne({ _id: req.params.id, user: req.user?.id }).exec()
      // else res.sendStatus(404)
      
      
      Log("dbListRes", dbListRes)


      if (dbListRes != null) res.json(dbListRes)
      // bad request:
      else res.sendStatus(400)
    } catch (e) {
      console.error(e)

      // bad request:
      res.sendStatus(400)
    }
  })


  // edit user profile settings:
  login.route("/profile")
  // edit user:
  .patch(async (req, res) => {
    // note: mongoose only supports limited validation using find and update
    try {
      const Log = log.stackLogger(["mongooseConnectPromise.then","login.route('/profile').patch"])
      
      
      Log("req.body", req.body, "req.params", req.params, "req.user", req.user)
      
      
      /** @todo improve handling for missing user, when deleted in another session. */
      /** @todo improve handling for errors. */
      const dbRes = await Users.updateOne({ 
          _id: req.user?.id 
        }, 
        { 
          $set: { username: req.body.username } 
        }
      ).exec()
      // else res.sendStatus(404)
      
      
      Log("dbRes", dbRes)

      
      if (dbRes) res.json(dbRes)
      // bad request:
      else res.sendStatus(400)
    } catch (e){
      console.error(e)
      
      // bad request:
      res.sendStatus(400)
    }
  })
  // delete user and all user owned lists:
  .delete(async (req, res) => {
    try {
      const Log = log.stackLogger(["mongooseConnectPromise.then","login.route('/profile').delete"])
      
      
      Log("req.user", req.user)
      
      
      // all user owned lists:
      const dbListRes = await Lists.deleteMany({ user: req.user?.id }).exec()
      
      
      Log("dbListRes", dbListRes)
      
      
      /** @todo improve handling for missing user, when deleted in another session. */
      /** @todo improve handling for errors. */
      // delete user:
      const dbUserRes = await Users.deleteOne({ _id: req.user?.id }).exec()
      
      
      Log("dbUserRes", dbUserRes)
      
      
      // return successful deletion:
      res.json(dbUserRes)
      
      /** @todo log out any other sessions. */
      req.logout({ keepSessionInfo: false }, (err) => {
        console.error(err)
      })
    } catch (e){
      console.error(e)

      // bad request:
      res.sendStatus(400)
    }
  })
})
.catch((reason) => {
  console.error(`\n\tERROR!:\n${reason}`)


  // no mongoDB available, cannot process logins:
  login.use((_req, res) => {
    console.error(`\n\tERROR! No MongoDB available.\nError:\n${reason}`.repeat(20))
    
    res.sendStatus(503)
  })
})


export { 
  login, 
  loginSession,
  passportInit,
  passportSession
}