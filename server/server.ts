// load dotenv .env before all modules:
require("dotenv").config({ path: "../.env" })
import path from "node:path"
import fs from "node:fs"
import express, { ErrorRequestHandler } from "express"
import cons from "consolidate"
import cors from "cors"
import { dbgLog } from "~types/api"
import { assetsRouter } from "./assets-router"
import { dbHandler } from "./database"
import { login } from "./login"
const MANIFEST_JSON = require("../dist/manifest.json")

/**
 * @file The main server.
 */

/**
 * The main Express app that imports all the other Express Routers for separated concerns.
 */
const app = express()

// server root file path, relative to tsc outDir for this file:
const PROJECT_ROOT: string & fs.PathLike = path.join(__dirname, "../")
const STATIC_ROOT: string & fs.PathLike = path.join(PROJECT_ROOT, "./dist")

const {
  // server port:
  PORT = 8080,
  // vite dev server port:
  VITE_PORT = 5173,
  NODE_ENV
} = process.env

// init debug logger:
const log = dbgLog.fileLogger("server.ts")

// CORS headers for vite dev server:
app.use(
  cors({
    origin: ["*", `http://localhost:${VITE_PORT}`, `http://localhost:${PORT}`]
  })
)

// vite output dir as static dir:
app.use(express.static(STATIC_ROOT))

// for parsing application/json:
app.use(express.json())

// for parsing application/x-www-form-urlencoded:
app.use(express.urlencoded({ extended: true }))

// handlebars template engine:
app.engine("hbs", cons.handlebars)
app.set("view engine", "hbs")

// handlebars views dir:
app.set("views", path.join(PROJECT_ROOT, "./views"))

// logging middleware:
app.use((req, _res, next) => {
  // prettier-ignore
  log("app.use",
    "req.originalUrl", req.originalUrl,
    "req.url", req.url,
    "req.baseUrl", req.baseUrl,
    "req.path", req.path,
    "req.route", req.route,
    "req.hostname", req.hostname,
    "req.cookies", req.cookies,
    "req.signedCookies", req.signedCookies,
    "req.headers", req.headers,
    "req.user", req.user,
    "req.protocol", req.protocol,
    "req.method", req.method,
    "req.xhr", req.xhr,
    "req.query", req.query,
    "req.params", req.params,
    "req.body", req.body
  )

  next()
})

// dev server router:
app.use("/src", assetsRouter)

// mongodb server handler and user account handler:
app.use("/api/v1", dbHandler, login)

app.get("/*", (req, res) => {
  // const mapping = MANIFEST_JSON["src/main.tsx"]
  const mapping = Object.values(
    MANIFEST_JSON as Record<string, Record<string, string | string[] | boolean>>
  ).filter(chunk => chunk.isEntry)

  // vite dev script for React.js HMR:
  const VITE_DEV = `
    <script type="module">
      import RefreshRuntime from "http://localhost:${VITE_PORT}/@react-refresh"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
    </script>

    <script type="module" src="http://localhost:${VITE_PORT}/@vite/client"></script>
    <script type="module" src="http://localhost:${VITE_PORT}/${
    mapping.find(chunk => "css" in chunk)?.src
  }"></script>
`
  // log("MANIFEST_JSON isEntry mapping", mapping, "VITE_DEV", VITE_DEV)

  res.render("index", {
    production: NODE_ENV === "production",
    VITE_DEV,
    js: mapping.map(entryChunk => entryChunk.file),
    css: mapping
      .filter(entryChunk => "css" in entryChunk)
      .map(entryChunk => entryChunk.css)
      .flat(Infinity)
  })
})

// error handler middleware, doesn't emit errors to clients:
app.use(((err: Error, _req, res, _next) => {
  log("Error Handling Middleware",
    "error.name", err.name,
    "error.message", err.message,
    "error.cause", err.cause,
    "error.stack", err.stack
  )

  // internal server error:
  res.sendStatus(500)
}) as ErrorRequestHandler)

const server = app.listen(PORT, () => {
  console.log(
    `\n\tApp running in port ${PORT}`,
    `\n\n\tNODE_ENV MODE: "${process.env.NODE_ENV === "production" ? "production" : "developement"}"`,
    `\n\n\t> Local: http://localhost:${PORT}/`
  )
})

export {
  app,
  server,
  STATIC_ROOT,
  PROJECT_ROOT
}