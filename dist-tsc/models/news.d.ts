import mongoose from "mongoose";
export interface NewsType {
    title: string;
    link?: string;
    content?: string;
}
declare const News: mongoose.Model<NewsType, {}, {}, {}, mongoose.Schema<NewsType, mongoose.Model<NewsType, any, any, any, any>, {}, {}, {}, {}, "type", NewsType>>;
export default News;
//# sourceMappingURL=news.d.ts.map