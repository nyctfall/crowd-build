import mongoose from "mongoose";
declare const dbHandler: import("express-serve-static-core").Router;
declare let mongooseConnectPromise: ReturnType<typeof mongoose.connect>;
declare let mongooseConnect: typeof mongoose;
declare let mongoDBReady: Promise<unknown>;
export { dbHandler, mongoDBReady, mongooseConnect, mongooseConnectPromise };
export declare const mongooseConnection: mongoose.Connection;
//# sourceMappingURL=database.d.ts.map