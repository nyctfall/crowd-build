import mongoose, { Types } from "mongoose";
export interface UserType {
    username: string;
    password: string;
    lists?: Types.ObjectId[];
}
declare const Users: mongoose.Model<UserType, {}, {}, {}, any>;
export default Users;
//# sourceMappingURL=user.d.ts.map