import express from "express"
import mongoose from "mongoose"
import { dbgLog, HTTPStatusCode } from "~types/api"
import Parts from "./models/part"
import Lists from "./models/list"
import Users from "./models/user"
import News from "./models/news"

/**
 * @file The logic and HTTP handlers for the database quests and other db operations.
 */

/**
 * The MongoDB database API Express Router.
 */
const dbHandler = express.Router()

const { MONGODB = "mongodb://127.0.0.1:27017", REDIS } = process.env

// debugging logger:
const log = dbgLog.fileLogger("database.ts")

/**
 * Promise for mongoose connection.
 */
let mongooseConnectPromise: ReturnType<typeof mongoose.connect>

/**
 * Resolved promise value from mongoose connection.
 */
let mongooseConnect: Awaited<typeof mongooseConnectPromise>
;(async () => {
  // add error message for no database:
  if (!MONGODB) {
    log.error("MONGODB == false", "err", "\n\tERROR! Error: No MongoDB database!!!!".repeat(10))

    // send that server cannot use db:
    return dbHandler.use((_req, res) => {
      log.error(["MONGODB == false", "dbHandler.use"], "err", "\n\tERROR! Error: No MongoDB database!!!!".repeat(20))

      res.sendStatus(HTTPStatusCode["Service Unavailable"])
    })
  }

  // mongodb server:
  try {
    // connect to DB:
    mongooseConnectPromise = mongoose.connect(MONGODB)

    // wait for connection to finish:
    mongooseConnect = await mongooseConnectPromise

    console.log(`\n\t> MongoDB: "${MONGODB}" ready...`)

    // part database:
    dbHandler
      .route("/parts")
      /** @todo User suggested/voted parts POST, PATCH, DELETE? */
      .get(async (req, res) => {
        const Log = log.stackLogger("dbHandler.route('/parts').get")

        Log("req.query", req.query)

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
        const limit = Number(req.query.limit ?? Infinity)

        // prettier-ignore
        Log(
          "id", id,
          "name", name,
          "type", type,
          "oem", oem,
          "model", model,
          "minPrice", minPrice,
          "maxPrice", maxPrice,
          "releasedAfter", releasedAfter,
          "releasedBefore", releasedBefore,
          "typeInfo", typeInfo,
          "offset", offset,
          "limit", limit
        )

        try {
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

          Log("dbQuery", dbQuery)

          const dbRes = await dbQuery.exec()

          Log("dbRes", dbRes)

          // if there was no error, return result, which could be an empty array:
          if (dbRes.length > 0) res.json(dbRes)
          // if empty array, not parts were found:
          else res.status(HTTPStatusCode["Not Found"]).json(dbRes)
        } catch (e) {
          Log.error("err", e)

          // the db threw an error, somthing was wrong:
          res.sendStatus(HTTPStatusCode["Bad Request"])
        }
      })

    dbHandler
      .route("/parts/id/:id")
      /** @todo User suggested/voted parts POST, PATCH, PUT/DELETE? */
      .get(async (req, res) => {
        const Log = log.stackLogger("dbHandler.get('/parts/id/:id')")

        Log("req.params", req.params)

        try {
          // find one part by its id:
          const dbRes = await Parts.findById(req.params.id).exec()

          Log("dbRes", dbRes)

          if (dbRes) res.json(dbRes)
          else res.sendStatus(HTTPStatusCode["Not Found"])
        } catch (e) {
          Log.error("err", e)

          res.sendStatus(HTTPStatusCode["Bad Request"])
        }
      })

    // user created lists:
    dbHandler
      .route("/lists")
      .get(async (req, res) => {
        const Log = log.stackLogger("dbHandler.route('/lists').get")

        Log("req.query", req.query)

        // skip certain number of newest stories:
        const offset = Number(req.query.offset ?? 0)

        // only get limited number of stories:
        const limit = Number(req.query.limit ?? Infinity)

        Log("offset", offset, "limit", limit)

        try {
          // get lists:
          const dbRes = await Lists.find().sort({ createdAt: -1 }).skip(offset).limit(limit).exec()

          Log("dbRes", dbRes)

          // if there was no error, return result, which could be an empty array:
          if (dbRes.length > 0) res.json(dbRes)
          // if empty array, not parts were found:
          else res.status(HTTPStatusCode["Not Found"]).json(dbRes)
        } catch (e) {
          Log.error("err", e)

          res.sendStatus(HTTPStatusCode["Bad Request"])
        }
      })
      // save a list to db:
      .post(async (req, res) => {
        const Log = log.stackLogger("dbHandler.route('/lists').post")

        Log("req.body", req.body)

        try {
          const dbRes = await new Lists({ parts: req.body.parts }).save()

          Log("dbRes", dbRes)

          res.status(HTTPStatusCode["Created"]).json(dbRes)
        } catch (e) {
          Log.error("err", e)

          res.sendStatus(HTTPStatusCode["Bad Request"])
        }
      })

    // get, edit, or delete a list:
    dbHandler
      .route("/lists/id/:id")
      .get(async (req, res) => {
        const Log = log.stackLogger("dbHandler.route('/lists/id/:id').get")

        Log("req.params", req.params)

        try {
          // send the list at id if there is one:
          const dbRes = await Lists.findById(req.params.id).exec()

          Log("dbRes", dbRes)

          if (dbRes) res.json(dbRes)
          else res.sendStatus(HTTPStatusCode["Not Found"])
        } catch (e) {
          Log.error("err", e)

          res.sendStatus(HTTPStatusCode["Bad Request"])
        }
      })
      .patch(async (req, res) => {
        const Log = log.stackLogger("dbHandler.route('/lists/id/:id').patch")

        Log("req.params", req.params)

        // only edit lists not owned by a user:
        try {
          const dbRes = await Lists.updateOne(
            {
              _id: req.params.id,
              user: { $exists: false }
            },
            { $set: { parts: req.body.parts } }
          ).exec()

          Log("dbRes", dbRes)

          res.json(dbRes)
        } catch (e) {
          Log.error("err", e)

          res.sendStatus(HTTPStatusCode["Bad Request"])
        }
      })
      .delete(async (req, res) => {
        const Log = log.stackLogger("dbHandler.route('/lists/id/:id').delete")

        Log("req.params", req.params)

        // only delete lists not owned by a user:
        try {
          const dbRes = await Lists.deleteOne({
            _id: req.params.id,
            user: { $exists: false }
          }).exec()

          Log("dbRes", dbRes)

          res.json(dbRes)
        } catch (e) {
          Log.error("err", e)

          res.sendStatus(HTTPStatusCode["Bad Request"])
        }
      })

    // get a user:
    dbHandler.get("/users/id/:id", async (req, res) => {
      const Log = log.stackLogger("dbHandler.route('/users/id/:id').get")

      Log("req.params", req.params)

      // send the user at id if there is one:
      try {
        const dbRes = await Users.findById(req.params.id).select("-password").exec()

        Log("dbRes", dbRes)

        if (dbRes) res.json(dbRes)
        else res.sendStatus(HTTPStatusCode["Not Found"])
      } catch (e) {
        Log.error("err", e)

        res.sendStatus(HTTPStatusCode["Bad Request"])
      }
    })

    // get all users:
    dbHandler.get("/users", async (req, res) => {
      const Log = log.stackLogger("dbHandler.route('/users').get")

      Log("req.query", req.query)

      // skip certain number of newest stories:
      const offset = Number(req.query.offset ?? 0)

      // only get limited number of stories:
      const limit = Number(req.query.limit ?? Infinity)

      Log("offset", offset, "limit", limit)

      try {
        // get users:
        const dbRes = await Users
          .find()
          .select("-password")
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

        res.sendStatus(HTTPStatusCode["Bad Request"])
      }
    })

    // news story db:
    dbHandler.get("/news", async (req, res) => {
      const Log = log.stackLogger("dbHandler.route('/news').get")

      Log("req.query", req.query)

      // skip certain number of newest stories:
      const offset = Number(req.query.offset ?? 0)

      // only get limited number of stories:
      const limit = Number(req.query.limit ?? 1)

      Log("offset", offset, "limit", limit)

      try {
        // find latest news, limit is number of stories, and offset is how many of the latests to skip:
        const dbRes = await News.find({}).sort({ createdAt: -1 }).skip(offset).limit(limit).exec()

        Log("dbRes", dbRes)

        // if there was no error, return result, which could be an empty array:
        if (dbRes.length > 0) res.json(dbRes)
        // if empty array, not parts were found:
        else res.status(HTTPStatusCode["Not Found"]).json(dbRes)
      } catch (e) {
        Log.error("err", e)

        res.sendStatus(HTTPStatusCode["Bad Request"])
      }
    })
  } catch (e) {
    // something went wrong connecting to DB:
    log.error("catch await mongoose.connect", "err", e)

    // send that server cannot use db:
    dbHandler.use((_req, res) => {
      log.error(
        ["catch await mongoose.connect", "dbHandler.use"],
        "err",
        "\n\tError connecting to MongoDB database!!!!".repeat(10)
      )

      res.sendStatus(HTTPStatusCode["Service Unavailable"])
    })
  }
})()

export { dbHandler, mongooseConnect, mongooseConnectPromise }
