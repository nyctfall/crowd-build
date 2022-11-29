import mongoose, { ObjectId, Schema, Query, Document } from "mongoose";
import { PCPartInfo, PCPartType } from "~types/api";
export interface PCPartInfoQueryHelpers {
    byId(id: ObjectId | string | ObjectId[] | string[]): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers;
    byName(name: string): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers;
    byModel(model: string | string[] | RegExp | RegExp[]): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers;
    byOEM(oem: string | string[]): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers;
    byType(type: PCPartType): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers;
    byMaxPrice(maxPrice: string | number | Schema.Types.Decimal128 | Schema.Types.Number): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers;
    byMinPrice(minPrice: string | number | Schema.Types.Decimal128 | Schema.Types.Number): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers;
    byReleasedBefore(maxDate: Date | string): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers;
    byReleasedAfter(minDate: Date | string): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers;
    byTypeInfo(info: Record<string | number, any>): Query<any, Document<PCPartInfo>> & PCPartInfoQueryHelpers;
}
declare const Part: mongoose.Model<PCPartInfo, PCPartInfoQueryHelpers, {}, {}, any>;
export default Part;
//# sourceMappingURL=part.d.ts.map