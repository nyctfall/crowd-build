import jwt from "jsonwebtoken";
import Users from "./models/user";
declare const login: import("express-serve-static-core").Router;
declare global {
    interface JWTInfo {
        token: string;
        jwtPayload: jwt.JwtPayload;
    }
    namespace Express {
        interface User extends InstanceType<typeof Users> {
        }
        interface AuthInfo extends JWTInfo {
        }
    }
}
export { login };
//# sourceMappingURL=login.d.ts.map