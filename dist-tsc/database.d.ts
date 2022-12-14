import mongoose from "mongoose";
import { UnPromise } from "~types/api";
declare const dbHandler: import("express-serve-static-core").Router;
declare let mongooseConnectPromise: ReturnType<typeof mongoose.connect>;
declare let mongooseConnect: UnPromise<typeof mongooseConnectPromise>;
export { dbHandler, mongooseConnect, mongooseConnectPromise };
//# sourceMappingURL=database.d.ts.map