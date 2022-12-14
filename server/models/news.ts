import mongoose, { Schema, Model, Query, Document, ObjectId } from "mongoose"


export interface NewsType {
  title: string
  link?: string
  content?: string
}

export interface NewsTypeQueryHelpers {
  byId(id: ObjectId | string | ObjectId[] | string[]): Query<any, Document<NewsType>> & NewsTypeQueryHelpers
  byLink(link: string): Query<any, Document<NewsType>> & NewsTypeQueryHelpers
  byTitle(title: string): Query<any, Document<NewsType>> & NewsTypeQueryHelpers
  byContent(content: string): Query<any, Document<NewsType>> & NewsTypeQueryHelpers
  byCreatedBefore(maxDate: Date | string): Query<any, Document<NewsType>> & NewsTypeQueryHelpers
  byCreatedAfter(minDate: Date | string): Query<any, Document<NewsType>> & NewsTypeQueryHelpers
  byUpdatedBefore(maxDate: Date | string): Query<any, Document<NewsType>> & NewsTypeQueryHelpers
  byUpdatedAfter(minDate: Date | string): Query<any, Document<NewsType>> & NewsTypeQueryHelpers
}


const NewsSchema = new Schema<NewsType, Model<NewsType, NewsTypeQueryHelpers>>({
    title: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
    toObject: {
      transform(_doc, ret){
        // don't set __v in plain objects:
        if ("__v" in ret) delete ret.__v
        
        return ret
      }
    },
    toJSON: {
      transform(_doc, ret){
        // don't send __v in JSON:
        if ("__v" in ret) delete ret.__v
        
        return ret
      }
    },
    query: {
      byId(id: ObjectId | string | ObjectId[] | string[]){
        if (!Array.isArray(id)) return this.find({ _id: id })
        return this.find({ _id: { $in: id.flat(Infinity) } })
      },
      byTitle(title: string){
        return this.find({ title: new RegExp(title, "ig") })
      },
      byContent(content: string){
        return this.find({ content: new RegExp(content, "ig") })
      },
      byLink(link: string){
        return this.find({ link: new RegExp(link, "ig") })
      },
      byCreatedBefore(maxDate: Date | string){
        return this.find({ createdAt: { $lte: new Date(maxDate) } })
      },
      byCreatedAfter(minDate: Date | string){
        return this.find({ createdAt: { $gte: new Date(minDate) } })
      },
      byUpdatedBefore(maxDate: Date | string){
        return this.find({ updatedAt: { $lte: new Date(maxDate) } })
      },
      byUpdatedAfter(minDate: Date | string){
        return this.find({ updatedAt: { $gte: new Date(minDate) } })
      },
    }
  }
)


const News = mongoose.model<NewsType, Model<NewsType, NewsTypeQueryHelpers>>("News", NewsSchema)


export default News