import express from "express"
import path from "path"
// import { createRequire } from "node:module"
// import { dirname } from "node:path"
// import { fileURLToPath } from "node:url"
// const require = createRequire(import.meta.url)
import cons from "consolidate" // const cons = require("consolidate")
import cors from "cors" // const cors = require("cors")
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)
import { router as assetsRouter } from "./assets-router.js"
import { DB } from "./database"
import type { Duplex } from "stream"
import type { PathLike } from "fs"


const app = express()

// server port:
const { PORT = 8080 } = process.env

// server root file path, relative to tsc outDir for this file:
const ROOT: string & PathLike = path.join(__dirname, "../../../dist")

// CORS headers for dev server:
app.use(cors({
  origin: ["http://localhost:5173", `http://localhost:${PORT}`]
}))

app.use("/", express.static(ROOT))

// dev server router:
app.use("/src", assetsRouter)

app.use(express.json())

// handlebars template engine:
app.engine("hbs", cons.handlebars)
app.set("view engine", "hbs")
app.set("views", "./views")


// database api:
app.get("/api/v1/parts", (req, res) => {
  console.log("> /parts > req.query")
  console.log(req.query)
  
  res.json(DB(req.query))
})
app.get("/api/v1", (req, res) => {
  console.log("> req.query")
  console.log(req.query)
  
  res.json(DB(req.query))
})

app.get("/", (_req, res) => {
  res.render("index", {
    development: process.env.NODE_ENV !== "production",
    production: process.env.NODE_ENV === "production"
  })
})

app.get("/dev", (_req, res) => {
  res.sendFile("./dev.html", { root: ROOT })
})

app.get("/prod", (_req, res) => {
  res.sendFile("./prod.html", { root: ROOT })
})

app.get("/*", (_req, res) => {
  res.render("index", {
    development: process.env.NODE_ENV !== "production",
    production: process.env.NODE_ENV === "production"
  })
})

const server = app.listen(PORT, () => {
  console.log(`\n\tApp running in port ${PORT}`)
  console.log(`\n\tNODE_ENV MODE: ${process.env.NODE_ENV === "production" ? "production" : "developement"}`)
  console.log(`\n\t> Local: http://localhost:${PORT}/`)
})

/** @summary - closes server. */
const destroyServer = (()=>{
  const CONNECTIONS: Duplex[] = []
  
  server.on("connect", (connection: Duplex) => {
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    const index = CONNECTIONS.length
    
    CONNECTIONS.push(connection)
    console.log("open #", index)

    connection.on("close", function() {
      console.log("close #", index)
      CONNECTIONS.splice(index)
    })
  })

  server.on("connection", (connection: Duplex) => {
    console.log("______________________________________________________________________")
    const index = CONNECTIONS.length
    
    CONNECTIONS.push(connection)
    console.log("open #", index)

    connection.on("close", function() {
      console.log("close #", index)
      CONNECTIONS.splice(index)
    })
  })

  return () => {
    console.log("closing server...")
    server.close()
    
    console.log("destroying connections...")

    for (let conn of CONNECTIONS){
      console.log("destroying a connection...")
      conn.destroy()
    }

    process.exit()
  }
})()
  
// clean exit to close server
const exitServer = (signal: string) => {
  console.log(`\nServer received SIGNAL: ${signal}`)

  process.exit()
}

const cleanup = (exitCode: number) => {
  console.log(`\nClosing HTTP server. Exit code: ${exitCode}`)
  
  // prevent server from accepting new connections:
  server.close()

  // end current connections:
  destroyServer()

  process.exit()
}

process.on("exit", cleanup)
process.on("SIGTERM", exitServer)
process.on("SIGINT", exitServer)
process.on("SIGHUP", exitServer)