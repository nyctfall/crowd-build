/// <reference types="node" />
/// <reference types="node" />
import type { PathLike } from "fs";
declare const app: import("express-serve-static-core").Express;
declare const ROOT: string & PathLike;
declare const server: import("http").Server<typeof import("http").IncomingMessage, typeof import("http").ServerResponse>;
export { app, server, ROOT };
//# sourceMappingURL=server.d.ts.map