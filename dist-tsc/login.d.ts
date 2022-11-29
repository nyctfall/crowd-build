import express from "express";
import Users from "./models/user";
declare module "express-session" {
    interface SessionData {
        token: string;
    }
}
declare global {
    namespace Express {
        interface User extends InstanceType<typeof Users> {
        }
    }
}
declare const login: import("express-serve-static-core").Router;
declare const loginSession: express.RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
declare const passportInit: express.Handler;
declare const passportSession: any;
export { login, loginSession, passportInit, passportSession };
//# sourceMappingURL=login.d.ts.map