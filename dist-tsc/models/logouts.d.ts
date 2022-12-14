import mongoose from "mongoose";
export interface TokenLogoutType {
    token: String;
    expireAt: Date;
}
declare const Logouts: mongoose.Model<TokenLogoutType, {}, {}, {}, any>;
export default Logouts;
//# sourceMappingURL=logouts.d.ts.map