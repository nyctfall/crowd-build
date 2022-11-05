"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROOT = exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const consolidate_1 = __importDefault(require("consolidate"));
const cors_1 = __importDefault(require("cors"));
const assets_router_1 = require("./assets-router");
const database_1 = require("./database");
const login_1 = require("./login");
const api_1 = require("../types/api");
const app = (0, express_1.default)();
exports.app = app;
const { PORT = 8080, NODE_ENV } = process.env;
const ROOT = path_1.default.join(__dirname, "../../../dist");
exports.ROOT = ROOT;
app.use(database_1.dbHandler);
app.use(login_1.login);
app.use((0, cors_1.default)({
    origin: ["*", "http://localhost:5173", `http://localhost:${PORT}`]
}));
app.use("/", express_1.default.static(ROOT));
app.use("/src", assets_router_1.router);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.engine("hbs", consolidate_1.default.handlebars);
app.set("view engine", "hbs");
app.set("views", "./views");
app.get("/", (_req, res) => {
    res.render("index", {
        development: NODE_ENV !== "production",
        production: NODE_ENV === "production"
    });
});
app.get("/dev", (_req, res) => {
    res.sendFile("./dev.html", { root: ROOT });
});
app.get("/prod", (_req, res) => {
    res.sendFile("./prod.html", { root: ROOT });
});
app.get("/*", (_req, res) => {
    res.render("index", {
        development: NODE_ENV !== "production",
        production: NODE_ENV === "production"
    });
});
const server = app.listen(PORT, () => {
    console.log(`\n\tApp running in port ${PORT}`);
    console.log(`\n\tNODE_ENV MODE: ${process.env.NODE_ENV === "production" ? "production" : "developement"}`);
    console.log(`\n\t> Local: http://localhost:${PORT}/`);
});
exports.server = server;
const destroyServer = (() => {
    const CONNECTIONS = [];
    server.on("connect", (connection) => {
        const index = CONNECTIONS.length;
        CONNECTIONS.push(connection);
        (0, api_1.dbgLog)("server.ts", ["destroyServer", "server.on(\"connect\")"], "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~", "", "open #", index);
        connection.on("close", function () {
            (0, api_1.dbgLog)("server.ts", ["destroyServer", "server.on(\"connect\")", "connection.on(\"close\")"], "close #", index);
            CONNECTIONS.splice(index);
        });
    });
    server.on("connection", (connection) => {
        const index = CONNECTIONS.length;
        CONNECTIONS.push(connection);
        (0, api_1.dbgLog)("server.ts", ["destroyServer", "server.on(\"connection\")"], "____________________________________________________________________", "", "open #", index);
        connection.on("close", function () {
            (0, api_1.dbgLog)("server.ts", ["destroyServer", "server.on(\"connection\")", "connection.on(\"close\")"], "close #", index);
            CONNECTIONS.splice(index);
        });
    });
    return () => {
        console.log("\n\tclosing server...");
        server.close();
        console.log("\n\tdestroying connections...");
        for (let conn of CONNECTIONS) {
            console.log("\n\tdestroying a connection...");
            conn.destroy();
        }
        process.exit();
    };
})();
const exitServer = (signal) => {
    console.log(`\n\tServer received SIGNAL: ${signal}`);
    process.exit();
};
const cleanup = (exitCode) => {
    console.log(`\n\tClosing HTTP server. Exit code: ${exitCode}`);
    server.close();
    destroyServer();
    process.exit();
};
process.on("exit", cleanup);
process.on("SIGTERM", exitServer);
process.on("SIGINT", exitServer);
process.on("SIGHUP", exitServer);
//# sourceMappingURL=server.js.map