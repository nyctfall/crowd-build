import mongoose, { Types, Query, Document } from "mongoose";
import { PCPartType } from "~types/api";
export interface ListType {
    parts: Types.ObjectId[] | undefined;
    user?: Types.ObjectId;
}
export interface ListTypeQueryHelpers {
    byType(type: PCPartType): Query<any, Document<ListType>> & ListTypeQueryHelpers;
}
declare const List: mongoose.Model<ListType, ListTypeQueryHelpers, {}, {}, any>;
export default List;
//# sourceMappingURL=list.d.ts.map