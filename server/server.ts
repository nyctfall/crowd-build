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
import { router as assetsRouter } from "./assets-router"
import { dbHandler } from "./database"
import { login } from "./login"
import type { Duplex } from "stream"
import type { PathLike } from "fs"
import { dbgLog } from "../types/api"


const app = express()

// server port, MongoDB db server URI, Redis cache/db server URI:
const { PORT = 8080, NODE_ENV } = process.env

// server root file path, relative to tsc outDir for this file:
const ROOT: string & PathLike = path.join(__dirname, "../../../dist")


// mongodb server handler:
app.use(dbHandler)
// user account log-in handler:
app.use(login)

// CORS headers for dev server:
app.use(cors({
  origin: ["*", "http://localhost:5173", `http://localhost:${PORT}`]
}))

app.use("/", express.static(ROOT))

// dev server router:
app.use("/src", assetsRouter)

// for parsing application/json
app.use(express.json())
// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

// handlebars template engine:
app.engine("hbs", cons.handlebars)
app.set("view engine", "hbs")
app.set("views", "./views")



app.get("/", (_req, res) => {
  res.render("index", {
    development: NODE_ENV !== "production",
    production: NODE_ENV === "production"
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
    development: NODE_ENV !== "production",
    production: NODE_ENV === "production"
  })
})

const server = app.listen(PORT, () => {
  console.log(`\n\tApp running in port ${PORT}`)
  console.log(`\n\tNODE_ENV MODE: ${process.env.NODE_ENV === "production" ? "production" : "developement"}`)
  console.log(`\n\t> Local: http://localhost:${PORT}/`)
})

export { app, server, ROOT }

/** @summary - closes server. */
const destroyServer = (()=>{
  const CONNECTIONS: Duplex[] = []
  
  server.on("connect", (connection: Duplex) => {
    const index = CONNECTIONS.length
    
    CONNECTIONS.push(connection)
    
    dbgLog("server.ts", ["destroyServer","server.on(\"connect\")"], "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", "", "open #", index)
    
    connection.on("close", function() {
      dbgLog("server.ts", ["destroyServer","server.on(\"connect\")","connection.on(\"close\")"], "close #", index)
      
      CONNECTIONS.splice(index)
    })
  })
  
  server.on("connection", (connection: Duplex) => {
    const index = CONNECTIONS.length
    
    CONNECTIONS.push(connection)
    
    dbgLog("server.ts", ["destroyServer","server.on(\"connection\")"], "____________________________________________________________________", "", "open #", index)
    
    connection.on("close", function() {
      dbgLog("server.ts", ["destroyServer","server.on(\"connection\")","connection.on(\"close\")"], "close #", index)

      CONNECTIONS.splice(index)
    })
  })

  return () => {
    console.log("\n\tclosing server...")

    server.close()
    
    console.log("\n\tdestroying connections...")

    for (let conn of CONNECTIONS){
      console.log("\n\tdestroying a connection...")

      conn.destroy()
    }

    process.exit()
  }
})()
  
// clean exit to close server
const exitServer = (signal: string) => {
  console.log(`\n\tServer received SIGNAL: ${signal}`)

  process.exit()
}

const cleanup = (exitCode: number) => {
  console.log(`\n\tClosing HTTP server. Exit code: ${exitCode}`)
  
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