/// <reference types="node" />
/// <reference types="node" />
import fs from "node:fs";
declare const app: import("express-serve-static-core").Express;
declare const STATIC_ROOT: string & fs.PathLike;
declare const server: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
export { app, server, STATIC_ROOT as ROOT };
//# sourceMappingURL=server.d.ts.map