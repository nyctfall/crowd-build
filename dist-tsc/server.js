"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROJECT_ROOT = exports.STATIC_ROOT = exports.server = exports.app = void 0;
require("dotenv").config({ path: "../.env" });
const node_path_1 = __importDefault(require("node:path"));
const express_1 = __importDefault(require("express"));
const consolidate_1 = __importDefault(require("consolidate"));
const cors_1 = __importDefault(require("cors"));
const api_1 = require("~types/api");
const assets_router_1 = require("./assets-router");
const database_1 = require("./database");
const login_1 = require("./login");
const MANIFEST_JSON = require("../dist/manifest.json");
const app = (0, express_1.default)();
exports.app = app;
const PROJECT_ROOT = node_path_1.default.join(__dirname, "../");
exports.PROJECT_ROOT = PROJECT_ROOT;
const STATIC_ROOT = node_path_1.default.join(PROJECT_ROOT, "./dist");
exports.STATIC_ROOT = STATIC_ROOT;
const { PORT = 8080, VITE_PORT = 5173, NODE_ENV } = process.env;
const log = api_1.dbgLog.fileLogger("server.ts");
app.use((0, cors_1.default)({
    origin: ["*", `http://localhost:${VITE_PORT}`, `http://localhost:${PORT}`]
}));
app.use(express_1.default.static(STATIC_ROOT));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.engine("hbs", consolidate_1.default.handlebars);
app.set("view engine", "hbs");
app.set("views", node_path_1.default.join(PROJECT_ROOT, "./views"));
app.use((req, _res, next) => {
    log("app.use", "req.originalUrl", req.originalUrl, "req.url", req.url, "req.baseUrl", req.baseUrl, "req.path", req.path, "req.route", req.route, "req.hostname", req.hostname, "req.cookies", req.cookies, "req.signedCookies", req.signedCookies, "req.headers", req.headers, "req.user", req.user, "req.protocol", req.protocol, "req.method", req.method, "req.xhr", req.xhr, "req.query", req.query, "req.params", req.params, "req.body", req.body);
    next();
});
app.use("/src", assets_router_1.assetsRouter);
app.use("/api/v1", database_1.dbHandler, login_1.login);
app.get("/*", (req, res) => {
    const mapping = Object.values(MANIFEST_JSON).filter(chunk => chunk.isEntry);
    const VITE_DEV = `
    <script type="module">
      import RefreshRuntime from "http://localhost:${VITE_PORT}/@react-refresh"
      RefreshRuntime.injectIntoGlobalHook(window)
      window.$RefreshReg$ = () => {}
      window.$RefreshSig$ = () => (type) => type
      window.__vite_plugin_react_preamble_installed__ = true
    </script>

    <script type="module" src="http://localhost:${VITE_PORT}/@vite/client"></script>
    <script type="module" src="http://localhost:${VITE_PORT}/${mapping.find(chunk => "css" in chunk)?.src}"></script>
`;
    res.render("index", {
        production: NODE_ENV === "production",
        VITE_DEV,
        js: mapping.map(entryChunk => entryChunk.file),
        css: mapping
            .filter(entryChunk => "css" in entryChunk)
            .map(entryChunk => entryChunk.css)
            .flat(Infinity)
    });
});
app.use(((err, _req, res, _next) => {
    log("Error Handling Middleware", "error.name", err.name, "error.message", err.message, "error.cause", err.cause, "error.stack", err.stack);
    res.sendStatus(api_1.HTTPStatusCode["Internal Server Error"]);
}));
const server = app.listen(PORT, () => {
    console.log(`\n\tApp running in port ${PORT}`, `\n\n\tNODE_ENV MODE: "${process.env.NODE_ENV === "production" ? "production" : "developement"}"`, `\n\n\t> Local: http://localhost:${PORT}/`);
});
exports.server = server;
//# sourceMappingURL=server.js.map