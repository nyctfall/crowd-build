import mongoose from "mongoose";
declare const dbHandler: import("express-serve-static-core").Router;
declare let mongooseConnectPromise: ReturnType<typeof mongoose.connect>;
declare let mongooseConnect: Awaited<typeof mongooseConnectPromise>;
export { dbHandler, mongooseConnect, mongooseConnectPromise };
//# sourceMappingURL=database.d.ts.map