import mongoose, { ObjectId, Schema } from "mongoose";
import { PCPartType } from "../../types/api";
declare const Part: mongoose.Model<Record<string, any>, {
    byId<T extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T, id: ObjectId | string | ObjectId[] | string[]): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
    byName<T_1 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T_1, name: string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
    byModel<T_2 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T_2, model: string | string[] | RegExp | RegExp[]): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
    byOEM<T_3 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T_3, oem: string | string[]): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
    byType<T_4 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T_4, type: PCPartType): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
    byMaxPrice<T_5 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T_5, maxPrice: string | number | Schema.Types.Decimal128 | Schema.Types.Number): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
    byMinPrice<T_6 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T_6, minPrice: string | number | Schema.Types.Decimal128 | Schema.Types.Number): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
    byReleasedBefore<T_7 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T_7, maxDate: Date | string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
    byReleasedAfter<T_8 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T_8, minDate: Date | string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
    byTypeInfo<T_9 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T_9, info: Record<string | number, any>): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {
    byId<T extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T, id: ObjectId | string | ObjectId[] | string[]): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
    byName<T_1 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T_1, name: string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
    byModel<T_2 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T_2, model: string | string[] | RegExp | RegExp[]): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
    byOEM<T_3 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T_3, oem: string | string[]): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
    byType<T_4 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T_4, type: PCPartType): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
    byMaxPrice<T_5 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T_5, maxPrice: string | number | Schema.Types.Decimal128 | Schema.Types.Number): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
    byMinPrice<T_6 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T_6, minPrice: string | number | Schema.Types.Decimal128 | Schema.Types.Number): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
    byReleasedBefore<T_7 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T_7, maxDate: Date | string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
    byReleasedAfter<T_8 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T_8, minDate: Date | string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
    byTypeInfo<T_9 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>>(this: T_9, info: Record<string | number, any>): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>)[], mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<Record<string, any>>> & mongoose.FlatRecord<Record<string, any>> & Required<{
        _id: unknown;
    }>>;
}, {}, {}, "type", Record<string, any>>>;
export default Part;
//# sourceMappingURL=part.d.ts.map