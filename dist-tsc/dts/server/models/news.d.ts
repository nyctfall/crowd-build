import mongoose, { ObjectId } from "mongoose";
declare const News: mongoose.Model<{
    title: string;
    createdAt: string;
    updatedAt: string;
    link?: string | undefined;
    content?: string | undefined;
}, {
    byId<T extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>>(this: T, id: ObjectId | string | ObjectId[] | string[]): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    })[], mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>;
    byTitle<T_1 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>>(this: T_1, title: string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    })[], mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>;
    byContent<T_2 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>>(this: T_2, content: string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    })[], mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>;
    byLink<T_3 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>>(this: T_3, link: string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    })[], mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>;
    byCreatedBefore<T_4 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>>(this: T_4, maxDate: Date | string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    })[], mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>;
    byCreatedAfter<T_5 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>>(this: T_5, minDate: Date | string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    })[], mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>;
    byUpdatedBefore<T_6 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>>(this: T_6, maxDate: Date | string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    })[], mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>;
    byUpdatedAfter<T_7 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>>(this: T_7, minDate: Date | string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    })[], mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>;
}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {
    byId<T extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>>(this: T, id: ObjectId | string | ObjectId[] | string[]): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    })[], mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>;
    byTitle<T_1 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>>(this: T_1, title: string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    })[], mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>;
    byContent<T_2 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>>(this: T_2, content: string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    })[], mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>;
    byLink<T_3 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>>(this: T_3, link: string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    })[], mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>;
    byCreatedBefore<T_4 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>>(this: T_4, maxDate: Date | string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    })[], mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>;
    byCreatedAfter<T_5 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>>(this: T_5, minDate: Date | string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    })[], mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>;
    byUpdatedBefore<T_6 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>>(this: T_6, maxDate: Date | string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    })[], mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>;
    byUpdatedAfter<T_7 extends mongoose.Query<unknown, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>>(this: T_7, minDate: Date | string): mongoose.Query<(mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    })[], mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }, {}, mongoose.Document<unknown, any, mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }>> & mongoose.FlatRecord<{
        title: string;
        createdAt: string;
        updatedAt: string;
        link?: string | undefined;
        content?: string | undefined;
    }> & {
        _id: mongoose.Types.ObjectId;
    }>;
}, {}, {}, "type", {
    title: string;
    createdAt: string;
    updatedAt: string;
    link?: string | undefined;
    content?: string | undefined;
}>>;
export default News;
//# sourceMappingURL=news.d.ts.map