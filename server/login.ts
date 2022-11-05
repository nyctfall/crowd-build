import express from "express"
import cors from "cors"
import jwt from "jsonwebtoken"
// import session from "express-session"
// import passport from "passport"
// import { ExtractJwt, Strategy } from "passport-jwt"
import Users, { UserType } from "./models/user"
import Lists from "./models/list"
import { mongoDBReady } from "./database"
import { dbgLog, SessionType } from "../types/api"

/**
 * @file Handles user account sign-in.
 */

const login = express.Router()

// server port, MongoDB db server URI, Redis cache/db server URI:
const { PORT = 8080, SECRET = "secret" } = process.env

// CORS headers for dev server:
login.use(cors({
  origin: ["*", "http://localhost:5173", `http://localhost:${PORT}`]
}))

// for parsing application/json
login.use(express.json())
// for parsing application/x-www-form-urlencoded
login.use(express.urlencoded({ extended: true }))

// user session:
// login.use(session({
//   secret: SECRET,
//   resave: true,
//   saveUninitialized: true
// }))

// passport init:
// login.use(passport.initialize())
// login.use(passport.session())
// passport.use(new Strategy({ secretOrKey: SECRET, jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() }, (jwt, done) => {
//   /** @todo */
// }))

/*
// no db available, cannot function:
login.use(["/api/v1/profile", "/api/v1/profile/*", "/api/v1/login", "/api/v1/signup", "/api/v1/logout"], (req, res, next) => {
  res.sendStatus(503)
  next()
}) 
*/

// requires db:
mongoDBReady.then(() => {
  console.log("\n\t> Login Session ready...")

  /** @todo better handling of log out invalidating JWT tokens, and redis store... */
  const validTokens: Set<string> = new Set()

  // promisified jwt.verify():
  const jwtVerifyPromise = (token: string, SECRET: jwt.Secret) => new Promise((resolve, reject) => 
    jwt.verify(token, SECRET, (err, decodedJWT) => err ? reject(err) : resolve(decodedJWT))
  )
  
  // consistant jwt signing config:
  const jwtSign = (payload: jwt.JwtPayload) => new Promise<string>((resolve, reject) => 
    jwt.sign(payload, SECRET, { expiresIn: "5m" }, (err, token) => err ? reject(err) : resolve(token as string))
  )
  
  /** @todo IMPORTANT: bcrypt password for security! */
  login.post("/api/v1/login", async (req, res) => {
    try {
      const { username, password } = req.body
      
      
      dbgLog("login.ts", ["mongoDBReady.then","login.post(\"/api/v1/login\")"], "username", username, "password", password, "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params)
      
      
      // look for existing user:
      const user = await Users.findOne({ username }).exec()
      
      
      dbgLog("login.ts", ["mongoDBReady.then","login.post(\"/api/v1/login\")"], "user", user)
      
      
      // return and send responce of not found user:
      /** @todo improve api responces for incorrect data request. edit of front-end required */
      if (!user){
        res/* .status(404) */.json({ success: false, nonexistant: true } as SessionType)
        return
      }

      // return and send responce of wrong password to user:
      /** 
       * @todo IMPORTANT: bcrypt password for security!
       * @todo improve api responces for incorrect data request. edit of front-end required 
       */
      if (password !== user.password){
        res/* .status(401) */.json({ success: false, conflict: true, incorrect: ["password"] } as SessionType)
        return
      }
      
      // signin JWT token:
      const token = await jwtSign({ id: user.id, username: user.username })
      
      // add to valid array to make sign out work:
      validTokens.add(token)
      
      
      dbgLog("login.ts", ["mongoDBReady.then","login.post(\"/api/v1/login\")"], "token", token, "validTokens", validTokens, "user", user)
      
      
      // respond with success:
      res.json({ success: true, user, token } as Omit<SessionType, "user"> & {user:UserType})
    } catch (e){
      console.error(e)
      
      res.sendStatus(400)
    }
  })

  /** @todo IMPORTANT: bcrypt password for security! */
  login.post("/api/v1/signup", async (req, res) => {
    try {
      const { username, password } = req.body


      dbgLog("login.ts", ["mongoDBReady.then","login.post(\"/api/v1/signup\")"], "username", username, "password", password, "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params)
      
      
      // check for pre-existing user name:
      const userTaken = await Users.find({ username }).exec()
      
      
      dbgLog("login.ts", ["mongoDBReady.then","login.post(\"/api/v1/signup\")"], "userTaken", userTaken)
      
      
      // return and send responce of problem to user:
      /** @todo improve api responces for incorrect data request. edit of front-end required */
      if (userTaken.length > 0){
        res/* .status(409) */.json({ success: false, conflict: true, preexisting: ["username"] } as SessionType)
        return
      }
      
      // create new user:
      /** @todo IMPORTANT: bcrypt password for security! */
      const newUser = new Users({ username, password })
      
      
      dbgLog("login.ts", ["mongoDBReady.then","login.post(\"/api/v1/signup\")"], "newUser", newUser)
      
      
      // save user:
      await newUser.save()
      
      // signin JWT token:
      const token = await jwtSign({ id: newUser.id, username: newUser.username })
      
      // add to valid array to make sign out work:
      validTokens.add(token)
      
      
      dbgLog("login.ts", ["mongoDBReady.then","login.post(\"/api/v1/signup\")"], "token", token, "valvalidTokens", validTokens)
      

      // respond with success:
      res.json({ success: true, user: newUser.toObject(), token } as SessionType)
    } catch (e){
      console.error(e)
      
      res.sendStatus(400)
    }
  })

  login.post("/api/v1/logout", async (req, res) => {
    dbgLog("login.ts", ["mongoDBReady.then","login.post(\"/api/v1/logout\")"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params, "req.user", req.user, "req.headers", req.headers)
      
    
    const tokenToInvalidate = req.headers.authorization?.split(' ')[1]


    dbgLog("login.ts", ["mongoDBReady.then","login.post(\"/api/v1/logout\")"], "tokenToInvalidate", tokenToInvalidate)
    
    
    // invalidating the token:
    if (tokenToInvalidate && validTokens.has(tokenToInvalidate) && !validTokens.delete(tokenToInvalidate) && validTokens.has(tokenToInvalidate)){
      // token was not deleted:
      res.status(500).send({ success: false } as SessionType)
      return
    }
    
    // token was successfully invalidated, didn't exist, or was alredy invalid:
    res.send({ success: true } as SessionType)
  })

  // user profile page:
  login.use(["/api/v1/profile", "/api/v1/profile/*"], async (req, res, next) => {
    dbgLog("login.ts", ["mongoDBReady.then","login.use([\"/api/v1/profile\", \"/api/v1/profile/*\"],)"], "req.path", req.path, "request.headers", req.headers, "req.body", req.body, "req.query", req.query, "req.params", req.params, "req.user", req.user)
    
    
    // Authorization: 'Bearer TOKEN':
    const token = req.headers.authorization?.split(' ')[1]
    

    try {
      dbgLog("login.ts", ["mongoDBReady.then","login.use([\"/api/v1/profile\", \"/api/v1/profile/*\"],)"], "token", token)
      
      
      // check token:
      if (!token || !validTokens.has(token)){
        // redirect to login when not logged in:
        res.status(401).redirect("/api/v1/login")
        return
      }
      
      // Decoding the token:
      const decodedToken = await jwtVerifyPromise(token, SECRET)
      
      // add user prop to request using this middleware:
      req.user = decodedToken as jwt.JwtPayload
      (req as any)._jwtToken = token
      

      dbgLog("login.ts", ["mongoDBReady.then","login.use([\"/api/v1/profile\", \"/api/v1/profile/*\"],)"], "token", token, "decodedToken", decodedToken, "req.user", req.user)
      
      
      // send page:
      next()
    } catch (e){
      console.error(e)
      
      // remove expired token from valid tokens:
      if (token) validTokens.delete(token)
      
      dbgLog("login.ts", ["mongoDBReady.then","login.use([\"/api/v1/profile\", \"/api/v1/profile/*\"],)"], "token", token, "validTokens", validTokens, "req.user", req.user)
      
      // redirect to login when not logged in:
      res/* .status(401) */.redirect("/api/v1/login")
    }
  })
  
  login.route("/api/v1/profile/lists")
  // get all user owned lists:
  .get(async (req, res) => {
    // send all lists owned by user:
    try {
      // skip certain number of newest stories:
      const offset = Number(req.query.offset ?? 0)
      // only get limited number of stories:
      const limit = Number(req.query.limit ?? 1)


      dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile/lists\").get"], "offset", offset, "limit", limit, "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params, "req.user", req.user)
      

      const dbRes = await Lists.find({ user: (req.user as jwt.JwtPayload)?.id }).sort({ createdAt: -1 }).skip(offset).limit(limit).exec()


      dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile/lists\").get"], "dbRes", dbRes)
      

      if (dbRes != null) res.json(dbRes)
      else res.sendStatus(404)
    } catch (e) {
      console.error(e)
      
      res.sendStatus(400)
    }
  })
  // save a user specific list:
  .post(async (req, res) => {
    try {
      // save new list:
      const newList = await new Lists({ parts: req.body.parts, user: (req.user as jwt.JwtPayload)?.id }).save()
      

      dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile/lists\").post"], "newList", newList, "logged in user", req.user, "req.body", req.body, "req.params", req.params, "req.query", req.query)
      

      // save list id to user:
      const user = await Users.findById((req.user as jwt.JwtPayload)?.id).exec()
      

      dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile/lists\").post"], "mongo user before", user?.toJSON())
      

      // don't save to user if user was not found:
      if (!user) {
        res.json(newList)
        return
      }
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
      dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile/lists\").post"], "mongo user after", (await user.populate("lists")).toJSON())
      

      // // return user with added list:
      // res.json(user)
      if (newList != null) res.json(newList)
      // if (user != null){
      //   res.json(user.lists)
      //   await user.populate("lists")
      // }
      else res.sendStatus(400)
    } catch (e){
      console.error(e)
      
      res.sendStatus(400)
    }
  })
  // delete all user specific lists:
  .delete(async (req, res) => {
    // only delete all lists owned by user:
    try {
      dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile/lists\").get"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params, "req.user", req.user)
      

      const dbRes = await Lists.deleteMany({ user: (req.user as jwt.JwtPayload)?.id }).exec()


      dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile/lists\").get"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params, "req.user", req.user)


      if (dbRes != null) res.json(dbRes)
      else res.sendStatus(400)
    } catch (e) {
      console.error(e)

      res.sendStatus(400)
    }
  })

  // modify user specific lists:
  login.route("/api/v1/profile/lists/id/:id")
  .patch(async (req, res) => {
    // only edit lists not owned by user:
    try {
      dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile/lists/id/:id\").patch"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params, "req.user", req.user)
      

      /** @todo improve handling for missing list. */
      const dbRes = await Lists.updateOne({ _id: req.params.id, user: (req.user as jwt.JwtPayload)?.id }, { $set: { parts: req.body.parts } }).exec()
      // else res.sendStatus(404)
      

      dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile/lists/id/:id\").patch"], "req.path", req.path, "dbRes", dbRes)


      if (dbRes != null) res.json(dbRes)
      else res.sendStatus(400)
    } catch (e) {
      console.error(e)

      res.sendStatus(400)
    }
  })
  // delete user specific list:
  .delete(async (req, res) => {
    // only delete list owned by user:
    try {
      dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile/lists/id/:id\").delete"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params, "req.user", req.user)
      
      
      const dbUserRes = await Users.findById((req.user as jwt.JwtPayload)?.id).exec()
      
      // remove deleted list from user lists:
      /** @todo improve handling for missing user, when deleted in another session. */
      /** @todo improve handling for errors. */
      if (dbUserRes && dbUserRes.lists){        
        dbUserRes.lists = dbUserRes.lists.filter(listId => !listId.equals(req.params.id))
        
        dbUserRes.save()
        
        
        dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile/lists/id/:id\").delete"], "req.path", req.path, "dbUserRes", dbUserRes)
      }
      // if (dbUser == null) {
      //   const dbListDisownRes = await Lists.modifyOne(
      //     { _id: req.params.id, user: (req.user as jwt.JwtPayload)?.id }, 
      //     { $unset: "user" }
      //   ).exec()
      //   res.status(404).json({ user: dbUser, list: dbListDisownRes })
      // }

      /** @todo improve handling for missing list. */
      const dbListRes = await Lists.deleteOne({ _id: req.params.id, user: (req.user as jwt.JwtPayload)?.id }).exec()
      // else res.sendStatus(404)
      
      
      dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile/lists/id/:id\").delete"], "req.path", req.path, "dbListRes", dbListRes)


      if (dbListRes != null) res.json(dbListRes)
      else res.sendStatus(400)
    } catch (e) {
      console.error(e)

      res.sendStatus(400)
    }
  })

  login.route("/api/v1/profile")
  // edit user:
  .patch(async (req, res) => {
    // note: mongoose only supports limited validation using find and update
    try {
      dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile\").patch"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params, "req.user", req.user)
      
      
      /** @todo improve handling for missing user, when deleted in another session. */
      /** @todo improve handling for errors. */
      const dbRes = await Users.updateOne({ _id: (req.user as jwt.JwtPayload)?.id }, { $set: { username: req.body.username } }).exec()
      // else res.sendStatus(404)
      
      
      dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile\").patch"], "dbRes", dbRes)

      
      if (dbRes) res.json(dbRes)
      else res.sendStatus(400)
    } catch (e){
      console.error(e)
      
      res.sendStatus(400)
    }
  })
  // delete user and all user owned lists:
  .delete(async (req, res) => {
    try {
      dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile\").delete"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params, "req.user", req.user)
      
      
      // all user owned lists:
      const dbListRes = await Lists.deleteMany({ user: (req.user as jwt.JwtPayload)?.id }).exec()
      
      
      dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile\").delete"], "dbListRes", dbListRes)
      
      
      /** @todo improve handling for missing user, when deleted in another session. */
      /** @todo improve handling for errors. */
      // delete user:
      const dbUserRes = await Users.deleteOne({ _id: (req.user as jwt.JwtPayload)?.id }).exec()
      
      
      dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile\").delete"], "dbUserRes", dbUserRes)
      
      
      res.json(dbUserRes)
      
      // log out user that no longer exists:
      validTokens.delete((req as any)._jwtToken)
      
      // log out any other sessions:
      validTokens.forEach((token) => {
        let jwtSession
        
        try {
          // will throw error if expired:
          jwtSession = jwt.decode(token)
        } catch (e){
          console.error(e)
        }
        
        dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile\").delete","validTokens.forEach"], "token", token, "jwtSession", jwtSession, "req._jwtToken", (req as any)._jwtToken, "validTokens", validTokens)
        
        if (jwtSession && typeof jwtSession === "object" && typeof jwtSession.id === "string" && jwtSession.id === (req.user as jwt.JwtPayload)?.id) validTokens.delete(token)
      })
      

      dbgLog("login.ts", ["mongoDBReady.then","login.route(\"/api/v1/profile\").delete"], "req._jwtToken", (req as any)._jwtToken, "validTokens", validTokens)
    } catch (e){
      console.error(e)

      res.sendStatus(400)
    }
  })
})

export { login }