/// <reference types="node" />
/// <reference types="node" />
import fs from "node:fs";
declare const app: import("express-serve-static-core").Express;
declare const PROJECT_ROOT: string & fs.PathLike;
declare const STATIC_ROOT: string & fs.PathLike;
declare const server: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
export { app, server, STATIC_ROOT, PROJECT_ROOT };
//# sourceMappingURL=server.d.ts.map