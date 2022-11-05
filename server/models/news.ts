import mongoose, { ObjectId, Schema } from "mongoose"

const NewsSchema = new Schema({
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
    },
    createdAt: {
      type: String,
      required: true
    },
    updatedAt: {
      type: String,
      required: true
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


const News = mongoose.model("News", NewsSchema)
export default News