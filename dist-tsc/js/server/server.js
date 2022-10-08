"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const consolidate_1 = __importDefault(require("consolidate"));
const cors_1 = __importDefault(require("cors"));
const assets_router_js_1 = require("./assets-router.js");
const database_1 = require("./database");
const app = (0, express_1.default)();
const { PORT = 8080 } = process.env;
const ROOT = path_1.default.join(__dirname, "../../../dist");
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", `http://localhost:${PORT}`]
}));
app.use("/", express_1.default.static(ROOT));
app.use("/src", assets_router_js_1.router);
app.use(express_1.default.json());
app.engine("hbs", consolidate_1.default.handlebars);
app.set("view engine", "hbs");
app.set("views", "./views");
app.get("/api/v1/parts", (req, res) => {
    console.log("> /parts > req.query");
    console.log(req.query);
    res.json((0, database_1.DB)(req.query));
});
app.get("/api/v1", (req, res) => {
    console.log("> req.query");
    console.log(req.query);
    res.json((0, database_1.DB)(req.query));
});
app.get("/", (_req, res) => {
    res.render("index", {
        development: process.env.NODE_ENV !== "production",
        production: process.env.NODE_ENV === "production"
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
        development: process.env.NODE_ENV !== "production",
        production: process.env.NODE_ENV === "production"
    });
});
const server = app.listen(PORT, () => {
    console.log(`\n\tApp running in port ${PORT}`);
    console.log(`\n\tNODE_ENV MODE: ${process.env.NODE_ENV === "production" ? "production" : "developement"}`);
    console.log(`\n\t> Local: http://localhost:${PORT}/`);
});
const destroyServer = (() => {
    const CONNECTIONS = [];
    server.on("connect", (connection) => {
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        const index = CONNECTIONS.length;
        CONNECTIONS.push(connection);
        console.log("open #", index);
        connection.on("close", function () {
            console.log("close #", index);
            CONNECTIONS.splice(index);
        });
    });
    server.on("connection", (connection) => {
        console.log("______________________________________________________________________");
        const index = CONNECTIONS.length;
        CONNECTIONS.push(connection);
        console.log("open #", index);
        connection.on("close", function () {
            console.log("close #", index);
            CONNECTIONS.splice(index);
        });
    });
    return () => {
        console.log("closing server...");
        server.close();
        console.log("destroying connections...");
        for (let conn of CONNECTIONS) {
            console.log("destroying a connection...");
            conn.destroy();
        }
        process.exit();
    };
})();
const exitServer = (signal) => {
    console.log(`\nServer received SIGNAL: ${signal}`);
    process.exit();
};
const cleanup = (exitCode) => {
    console.log(`\nClosing HTTP server. Exit code: ${exitCode}`);
    server.close();
    destroyServer();
    process.exit();
};
process.on("exit", cleanup);
process.on("SIGTERM", exitServer);
process.on("SIGINT", exitServer);
process.on("SIGHUP", exitServer);
//# sourceMappingURL=server.js.map