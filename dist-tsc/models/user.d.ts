import mongoose, { Types, Query, Document } from "mongoose";
export interface UserType {
    username: string;
    password: string;
    lists?: Types.ObjectId[];
}
export interface UserTypeQueryHelpers {
    byUsername(username: string): Query<any, Document<UserType>> & UserTypeQueryHelpers;
}
declare const Users: mongoose.Model<UserType, UserTypeQueryHelpers, {}, {}, any>;
export default Users;
//# sourceMappingURL=user.d.ts.map