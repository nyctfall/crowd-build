import mongoose, { Query, Document, ObjectId } from "mongoose";
export interface NewsType {
    title: string;
    link?: string;
    content?: string;
}
export interface NewsTypeQueryHelpers {
    byId(id: ObjectId | string | ObjectId[] | string[]): Query<any, Document<NewsType>> & NewsTypeQueryHelpers;
    byLink(link: string): Query<any, Document<NewsType>> & NewsTypeQueryHelpers;
    byTitle(title: string): Query<any, Document<NewsType>> & NewsTypeQueryHelpers;
    byContent(content: string): Query<any, Document<NewsType>> & NewsTypeQueryHelpers;
    byCreatedBefore(maxDate: Date | string): Query<any, Document<NewsType>> & NewsTypeQueryHelpers;
    byCreatedAfter(minDate: Date | string): Query<any, Document<NewsType>> & NewsTypeQueryHelpers;
    byUpdatedBefore(maxDate: Date | string): Query<any, Document<NewsType>> & NewsTypeQueryHelpers;
    byUpdatedAfter(minDate: Date | string): Query<any, Document<NewsType>> & NewsTypeQueryHelpers;
}
declare const News: mongoose.Model<NewsType, NewsTypeQueryHelpers, {}, {}, any>;
export default News;
//# sourceMappingURL=news.d.ts.map