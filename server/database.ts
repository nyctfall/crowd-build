import cors from "cors"
import express from "express"
import mongoose from "mongoose"
import Parts from "./models/part"
import Lists from "./models/list"
import Users from "./models/user"
import News from "./models/news"
import { dbgLog } from "../types/api"

/**
 * @file The logic and HTTP handlers for the database quests and other db operations.
 */

const dbHandler = express.Router()

const { MONGODB, REDIS, PORT = 8080 } = process.env

// on connection promise:
let mongoDBReady = new Promise((resolve) => {
  const sayReady = () => resolve(true)
  
  mongoose.connection.on("connected", sayReady).on("connecting", sayReady).on("open", sayReady)
})

// for parsing application/json
dbHandler.use(express.json())
// for parsing application/x-www-form-urlencoded
dbHandler.use(express.urlencoded({ extended: true }))

// CORS headers for dev server:
dbHandler.use(cors({
  origin: ["*", "http://localhost:5173", `http://localhost:${PORT}`]
}))

// mongodb server:
if (MONGODB){
  ;(async () => {
    try {
      // connect to DB:
      await mongoose.connect(MONGODB)
      
      console.log(`\n\t> MongoDB: "${MONGODB}" ready...\n`)
      
      // mongodb server is up and running:
      mongoDBReady = Promise.resolve(true)
      
      // part database:
      dbHandler.route("/api/v1/parts")
      /** @todo User suggested/voted parts POST, PATCH, DELETE? */
      .get(async (req, res) => {
        try {
          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/parts\").get"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params)
          

          const id: any = req.query.id ?? req.query.ids
          const name: any = req.query.name ?? req.query.names
          const type: any = req.query.type ?? req.query.types
          const oem: any = req.query.oem ?? req.query.oems
          const model: any = req.query.model ?? req.query.models
          const minPrice: any = req.query.minPrice
          const maxPrice: any = req.query.maxPrice
          const releasedAfter: any = req.query.releasedAfter
          const releasedBefore: any = req.query.releasedBefore
          const typeInfo: any = req.query.typeInfo

          // skip certain number of newest stories:
          const offset = Number(req.query.offset ?? 0)
          // only get limited number of stories:
          const limit = Number(req.query.limit ?? 1)
          
          
          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/parts\").get"], "id", id, "name", name, "type", type, "oem", oem, "model", model, "minPrice", minPrice, "maxPrice", maxPrice, "releasedAfter", releasedAfter, "releasedBefore", releasedBefore, "typeInfo", typeInfo, "offset", offset, "limit", limit)


          // get a part by query params:
          const dbQuery = Parts.find()
          
          if (id) dbQuery.byId(id)
          if (name) dbQuery.byName(name)
          if (type) dbQuery.byType(type)
          if (oem) dbQuery.byOEM(oem)
          if (model) dbQuery.byModel(model)
          if (minPrice) dbQuery.byMinPrice(minPrice)
          if (maxPrice) dbQuery.byMaxPrice(maxPrice)
          if (releasedAfter) dbQuery.byReleasedAfter(releasedAfter)
          if (releasedBefore) dbQuery.byReleasedBefore(releasedBefore)
          if (typeInfo) dbQuery.byTypeInfo(typeInfo)
          
          const dbRes = await dbQuery.exec()
  

          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/parts\").get"], "dbRes", dbRes)
          

          // if there was no error, return result, which could be an empty array:
          if (dbRes != null) res.json(dbRes)
          else res.sendStatus(404)
        } catch(e){
          console.error(e)

          // the db threw an error, somthing was wrong:
          res.sendStatus(400)
        }
      })
      
      dbHandler.route("/api/v1/parts/id/:id")
      /** @todo User suggested/voted parts POST, PATCH, DELETE? */
      .get(async (req, res) => {
        // find one part by its id:
        try {
          dbgLog("database.ts", ["if(MONGODB)","dbHandler.get(\"/api/v1/parts/id/:id\")"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params)
          

          const dbRes = await Parts.findById(req.params.id).exec()
          

          dbgLog("database.ts", ["if(MONGODB)","dbHandler.get(\"/api/v1/parts/id/:id\")"], "req.path", req.path, "dbRes", dbRes)
          

          if (dbRes != null) res.json(dbRes)
          else res.sendStatus(404)
        } catch (e) {
          console.error(e)
          
          res.sendStatus(400)
        }
      })
      
      // user created lists:
      dbHandler.route("/api/v1/lists")
      .get(async (req, res) => {
        // send all lists:
        try {
          // skip certain number of newest stories:
          const offset = Number(req.query.offset ?? 0)
          // only get limited number of stories:
          const limit = Number(req.query.limit ?? 1)
          
          
          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/lists\").get"], "offset", offset, "limit", limit, "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params)
          
          
          const dbRes = await Lists.find().sort({ createdAt: -1 }).skip(offset).limit(limit).exec()
          

          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/lists\").get"], "dbRes", dbRes)
          

          if (dbRes != null) res.json(dbRes)
          else res.sendStatus(404)
        } catch (e) {
          console.error(e)
          
          res.sendStatus(400)
        }
      })
      // save a list to db:
      .post(async (req, res) => {
        try {
          

          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/lists\").post"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params)
          

          const dbRes = await new Lists({ parts: req.body.parts }).save()
          

          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/lists\").post"], "dbRes", dbRes)
          

          if (dbRes != null) res.json(dbRes)
          else res.sendStatus(404)
        } catch (e) {
          console.error(e)
          
          res.sendStatus(400)
        }
      })
      
      // get, edit, or delete a list:
      dbHandler.route("/api/v1/lists/id/:id")
      .get(async (req, res) => {
        // send the list at id if there is one:
        try {
          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/lists/id/:id\").get"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params)


          const dbRes = await Lists.findById(req.params.id).exec()


          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/lists/id/:id\").get"], "req.path", req.path, "dbRes", dbRes)
          

          if (dbRes != null) res.json(dbRes)
          else res.sendStatus(404)
        } catch (e) {
          console.error(e)

          res.sendStatus(400)
        }
      })
      .patch(async (req, res) => {
        // only edit lists not owned by a user:
        // note: mongoose only supports limited validation using find and update
        try {
          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/lists/id/:id\").patch"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params)


          const dbRes = await Lists.updateOne({ _id: req.params.id, user: { $exists: false } }, { $set: { parts: req.body.parts } }).exec()


          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/lists/id/:id\").patch"], "req.path", req.path, "dbRes", dbRes)


          if (dbRes != null) res.json(dbRes)
          else res.sendStatus(404)
        } catch (e) {
          console.error(e)

          res.sendStatus(400)
        }
      })
      .delete(async (req, res) => {
        // only delete lists not owned by a user:
        try {
          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/lists/id/:id\").delete"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params)


          const dbRes = await Lists.deleteOne({ _id: req.params.id, user: { $exists: false } }).exec()


          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/lists/id/:id\").delete"], "req.path", req.path, "dbRes", dbRes)

          
          if (dbRes != null) res.json(dbRes)
          else res.sendStatus(404)
        } catch (e) {
          console.error(e)

          res.sendStatus(400)
        }
      })

      // get, edit, or delete a user:
      dbHandler.route("/api/v1/users/id/:id")
      .get(async (req, res) => {
        // send the user at id if there is one:
        try {
          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/users/id/:id\").get"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params)


          const dbRes = await Users.findById(req.params.id).select("-password").exec()


          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/users/id/:id\").get"], "req.path", req.path, "dbRes", dbRes)


          if (dbRes != null) res.json(dbRes)
          else res.sendStatus(404)
        } catch (e) {
          console.error(e)

          res.sendStatus(400)
        }
      })

      // save a new user to db:
      dbHandler.route("/api/v1/users")
      .get(async (req, res) => {
        // get all users's usernames and ids:
        try {
          // skip certain number of newest stories:
          const offset = Number(req.query.offset ?? 0)
          // only get limited number of stories:
          const limit = Number(req.query.limit ?? 1)


          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/users\").get"], "offset", offset, "limit", limit, "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params)


          const dbRes = await Users.find().select("-password").sort({ createdAt: -1 }).skip(offset).limit(limit).exec()


          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/users\").get"], "dbRes", dbRes)


          if (dbRes != null) res.json(dbRes)
          else res.sendStatus(404)
        } catch (e){
          console.error(e)

          res.sendStatus(400)
        }
      })
      .post(async (req, res) => {
        try {
          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/users\").post"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params)


          const dbRes = await new Users(req.body).save()


          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/users\").post"], "dbRes", dbRes)


          if (dbRes != null) res.json(dbRes)
          else res.sendStatus(404)
        } catch (e){
          console.error(e)

          res.sendStatus(400)
        }
      })

      // news story db:
      dbHandler.get("/api/v1/news", async (req, res) => {
        // find latest news, limit is number of stories, and offset is how many of the latests to skip:
        try {
          // skip certain number of newest stories:
          const offset = Number(req.query.offset ?? 0)
          // only get limited number of stories:
          const limit = Number(req.query.limit ?? 1)


          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/users\").post"], "req.path", req.path, "req.body", req.body, "req.query", req.query, "req.params", req.params)


          const dbRes = await News.find({}).sort({ createdAt: -1 }).skip(offset).limit(limit).exec()


          dbgLog("database.ts", ["if(MONGODB)","dbHandler.route(\"/api/v1/users\").post"], "dbRes", dbRes)


          if (dbRes != null) res.json(dbRes)
          else res.sendStatus(404)
        } catch (e){
          console.error(e)

          res.sendStatus(400)
        }
      })
    }
    catch (err){
      // something went wrong connecting to DB:
      console.error(err)
    }  
  })()  
}  


export { dbHandler, mongoDBReady }