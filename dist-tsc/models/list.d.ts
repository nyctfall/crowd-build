import mongoose, { Types } from "mongoose";
export interface ListType {
    parts: Types.ObjectId[] | undefined;
    user?: Types.ObjectId;
}
declare const List: mongoose.Model<ListType, {}, {}, {}, any>;
export default List;
//# sourceMappingURL=list.d.ts.map